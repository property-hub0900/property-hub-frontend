"use client";

import { AuthContainer } from "@/components/auth/auth-container";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomFacebookButton } from "@/components/facebookLogin";
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
import { userAuthCustomerLoginSchema } from "@/schema/public/auth";
import { authService } from "@/services/public/auth";
import { useAuthStore } from "@/store/auth-store";
import { TUserAuthCustomerLoginSchema } from "@/types/public/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const { locale } = useParams();
  const t = useTranslations();
  const router = useRouter();
  const pushUserAfterLogin = `/${locale}/`;

  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(() => userAuthCustomerLoginSchema(t), [t]);

  const form = useForm<TUserAuthCustomerLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const userAuthCustomerLoginMutation = useMutation({
    mutationKey: ["userAuthCustomerLogin"],
    mutationFn: authService.userAuthCustomerLogin,
  });

  const customerSocialLoginMutation = useMutation({
    mutationKey: ["customerSocialLogin"],
    mutationFn: authService.customerSocialLogin,
  });

  const onSubmit = async (values: TUserAuthCustomerLoginSchema) => {
    try {
      const response = await userAuthCustomerLoginMutation.mutateAsync(values);
      useAuthStore.getState().login(response.data);
      router.push(pushUserAfterLogin);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Google login
  const handleGoogleSuccess = useCallback(
    async (credentialResponse: any) => {
      if (!credentialResponse?.credential) return;
      try {
        const response = await fetch("/api/auth/google/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });

        if (!response.ok) {
          toast.error(getErrorMessage(response.status));
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.user) {
          const { email, name, googleUserId } = data.user;

          const nameParts = name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          const loginResponse: Record<string, any> =
            await customerSocialLoginMutation.mutateAsync({
              googleId: googleUserId,
              email,
              firstName,
              lastName,
            });

          useAuthStore
            .getState()
            .login({ ...loginResponse.data, imageUrl: data.user.picture });

          toast.success(t("loginSuccess"));

          router.push(pushUserAfterLogin);
        }
      } catch (error: any) {
        toast.error(getErrorMessage(error));
      }
    },
    [customerSocialLoginMutation, pushUserAfterLogin, router, t]
  );

  const handleFacebookSuccess = useCallback(
    async (response: any) => {
      if (!response.accessToken) return;

      try {
        const { email, name, id: facebookId } = response;

        const nameParts = name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const loginResponse = await customerSocialLoginMutation.mutateAsync({
          facebookId,
          email,
          firstName,
          lastName,
        });

        localStorage.setItem("user", JSON.stringify(loginResponse.data));

        toast.success(t("loginSuccess"));

        router.push(pushUserAfterLogin);
      } catch (error: any) {
        console.error("Error during Facebook login:", error);
        toast.error(getErrorMessage(error));
      }
    },
    [customerSocialLoginMutation, t, router, pushUserAfterLogin]
  );

  return (
    <AuthContainer
      title={t("title.loginCustomerTitle")}
      subtitle={t("text.loginCustomerText")}
    >
      <Loader
        isLoading={
          customerSocialLoginMutation.isPending ||
          userAuthCustomerLoginMutation.isPending
        }
      ></Loader>
      <div className="social-buttons space-y-3 w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              shape="pill"
              width="100%"
              useOneTap={false}
              theme="outline"
              text="signin"
              logo_alignment="center"
            />
            {/* {isGoogleLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )} */}
          </div>

          <div className="facebook-auth-container relative w-full flex-1">
            <CustomFacebookButton
              appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string}
              callback={handleFacebookSuccess}
            />
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <span className="relative bg-background px-3 text-sm text-muted-foreground">
          {t("text.orContinueWith")}
        </span>
      </div>

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
                          showPassword ? "Hide password" : "Show password"
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
                href={`/${locale}/customer/forgot-password`}
                className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
              >
                {t("button.forgotPassword")}
              </Link>
            </div>

            <Button
              disabled={userAuthCustomerLoginMutation.isPending}
              type="submit"
              className={`w-full`}
            >
              {/* <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-4"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.span>
              </AnimatePresence> */}

              {t("button.login")}
            </Button>
          </form>
        </Form>
      </motion.div>

      <div className="text-center text-sm text-gray-500 mt-6">
        {t("text.noAccount")}{" "}
        <Link
          href={`/${locale}/customer/register`}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
        >
          {t("button.registerNow")}
        </Link>
      </div>

      {/* <Button
        variant={"outline"}
        className="w-full border border-primary text-primary mt-4"
        onClick={() => router.push(`/${locale}/company/login`)}
      >
        {t("button.loginAsAgent")}
      </Button> */}
    </AuthContainer>
  );
}
