"use client";

import type React from "react";

import { useTranslations } from "next-intl";
import { AuthContainer } from "@/components/auth/auth-container";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { userAuthStaffRegisterSchema } from "@/schema/auth";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { authService } from "@/services/public/auth";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/utils";
import { TUserAuthStaffRegisterSchema } from "@/types/public/auth";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Loader } from "@/components/loader";

export default function CompanyRegisterPage() {
  const t = useTranslations();
  const schema = useMemo(() => userAuthStaffRegisterSchema(t), [t]);

  const router = useRouter();
  const { locale } = useParams();

  const form = useForm<TUserAuthStaffRegisterSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      companyEmail: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const userAuthStaffRegisterMutation = useMutation({
    mutationKey: ["userAuthStaffRegister"],
    mutationFn: authService.userAuthStaffRegister,
  });

  async function onSubmit(values: TUserAuthStaffRegisterSchema) {
    try {
      const response = await userAuthStaffRegisterMutation.mutateAsync(values);
      toast.success(response.message);
      router.push(`/${locale}/company/verification?email=${values.email}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <AuthContainer
      title={t("title.registerCompanyTitle")}
      subtitle={t("text.registerCompanyText")}
      size="lg"
    >
      <Loader isLoading={userAuthStaffRegisterMutation.isPending}></Loader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter">
                  {t("form.firstName.label")}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("form.firstName.label")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.lastName.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.lastName.label")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.personalEmail.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.personalEmail.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.phoneNumber.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.phoneNumber.label")}
                    {...field}
                    //value={field.value.toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.companyName.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.companyName.label")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.companyEmail.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.companyEmail.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.password.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("form.password.label")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.confirmPassword.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("form.confirmPassword.label")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <Button
              disabled={userAuthStaffRegisterMutation.isPending}
              type="submit"
              className="w-full"
            >
              {t("button.next")}
            </Button>
          </div>
        </form>
      </Form>
    </AuthContainer>
  );
}
