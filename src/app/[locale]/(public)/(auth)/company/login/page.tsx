"use client";

import { AuthContainer } from "@/components/auth/auth-container";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/utils";
import { userAuthStaffLoginSchema } from "@/schema/public/auth";
import { authService } from "@/services/public/auth";
import { useAuthStore } from "@/store/auth-store";
import { TUserAuthStaffLoginSchema } from "@/types/public/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CompanyLoginPage() {
  const { locale } = useParams();
  const t = useTranslations();
  const router = useRouter();
  const pushUserAfterLogin = `/${locale}/company/dashboard`;

  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(() => userAuthStaffLoginSchema(t), [t]);

  const form = useForm<TUserAuthStaffLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const userAuthStaffLoginMutation = useMutation({
    mutationKey: ["userAuthStaffLogin"],
    mutationFn: authService.userAuthStaffLogin,
  });

  const onSubmit = async (values: TUserAuthStaffLoginSchema) => {
    try {
      const response = await userAuthStaffLoginMutation.mutateAsync(values);
      useAuthStore.getState().login(response.data);

      router.push(pushUserAfterLogin);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthContainer
      title={t("title.loginCompanyTitle")}
      subtitle={t("text.loginCompanyText")}
    >
      <Loader isLoading={userAuthStaffLoginMutation.isPending}></Loader>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.email.placeholder")}
                      type="email"
                      {...field}
                      autoComplete="email"
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        tabIndex={-1}
                        aria-label={
                          showPassword ? t("hidePassword") : t("showPassword")
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <Eye className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="rememberMe"
                      className="text-sm font-normal cursor-pointer select-none"
                    >
                      {t("text.rememberMe")}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link
                href={`/${locale}/company/forgot-password`}
                className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
              >
                {t("button.forgotPassword")}
              </Link>
            </div>

            <Button
              disabled={userAuthStaffLoginMutation.isPending}
              type="submit"
              className="w-full"
            >
              {t("button.login")}
            </Button>
          </form>
        </Form>
      </motion.div>

      <div className="text-center text-sm text-gray-500 mt-6">
        {t("text.noAgentAccount")}{" "}
        <Link
          href={`/${locale}/company/register`}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
        >
          {t("button.registerAsAgent")}
        </Link>
      </div>

      <Button
        variant="outline"
        className="w-full border border-primary text-primary mt-4"
        onClick={() => router.push(`/${locale}/customer/login`)}
      >
        {t("button.loginAsCustomer")}
      </Button>
    </AuthContainer>
  );
}
