"use client";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { Loader } from "@/components/loader";
import {
  changePasswordSchema,
  TChangePasswordSchema,
} from "@/schema/protected/customer";
import { customerService } from "@/services/protected/customer";
import { getErrorMessage } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

export const ChangePassword = () => {
  const t = useTranslations();

  const { user } = useAuth();

  const changePasswordMutation = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: customerService.changePassword,
  });

  const form = useForm<TChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema(t)),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TChangePasswordSchema) => {
    try {
      const payloads = { ...data, email: String(user?.email) };
      const response = await changePasswordMutation.mutateAsync(payloads);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <h5 className="mb-3">{t("title.changePassword")}</h5>
      <Loader isLoading={changePasswordMutation.isPending} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="  p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.currentPassword.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("form.currentPassword.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div></div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("form.password.placeholder")}
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
                        placeholder={t("form.confirmPassword.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="submit">{t("button.save")}</Button>
          </div>
        </form>
      </Form>
    </>
  );
};
