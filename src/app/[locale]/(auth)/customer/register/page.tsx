"use client";

import { AuthContainer } from "@/components/auth/auth-container";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { useAuthCustomerRegisterSchema } from "@/schema/auth";
import { authService } from "@/services/auth";
import { TUseAuthCustomerRegisterSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CustomerRegisterPage() {
  const t = useTranslations("");
  const router = useRouter();
  const { locale } = useParams();
  const schema = useAuthCustomerRegisterSchema(t);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TUseAuthCustomerRegisterSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const userAuthCustomerRegisterMutation = useMutation({
    mutationKey: ["userAuthCustomerRegister"],
    mutationFn: authService.userAuthCustomerRegister,
  });

  const onSubmit = async (values: TUseAuthCustomerRegisterSchema) => {
    setIsSubmitting(true);
    try {
      await userAuthCustomerRegisterMutation.mutateAsync(values);

      router.push(`/${locale}/customer/verification?email=${values.email}`);
    } catch (error: any) {

      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContainer
      title={t("welcome")}
      subtitle={t("registerSubtitle")}
      size="lg"
    >
      <Loader isLoading={userAuthCustomerRegisterMutation.isPending}></Loader>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
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
                  <FormLabel>{t("form.firstName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.firstName.placeholder")}
                      {...field}
                    />
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
                    <Input
                      placeholder={t("form.lastName.placeholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={
                        t("form.email.placeholder") || "example@xyz.com"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.phoneNumber.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={
                        t("form.phoneNumber.placeholder") || "+1 (555) 123-4567"
                      }
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
                      {...field}
                      placeholder={t("form.password.placeholder")}
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
                      {...field}
                      placeholder={t("form.confirmPassword.placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {t("next")}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </AuthContainer>
  );
}
