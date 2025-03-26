/* eslint-disable no-unused-vars */
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
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader } from "../loader";

type ResetPasswordFormProps = {
  t: any; // Translation function
  token: string;
  email: string;
  redirectPath: string;
  authService: {
    resetPassword: (data: {
      token: string;
      email: string;
      password: string;
    }) => Promise<any>;
  };
};

const createResetPasswordSchema = (t: any) =>
  z
    .object({
      password: z
        .string()
        .min(8, { message: t("form.password.errors.min") })
        .regex(/[A-Z]/, { message: t("form.password.errors.uppercase") })
        .regex(/[a-z]/, { message: t("form.password.errors.lowercase") })
        .regex(/[0-9]/, { message: t("form.password.errors.number") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("form.confirmPassword.errors.mismatch"),
      path: ["confirmPassword"],
    });

export function ResetPasswordForm({
  t,
  token,
  email,
  redirectPath,
  authService,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = createResetPasswordSchema(t);
  type ResetPasswordFormValues = z.infer<typeof schema>;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: authService.resetPassword,
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await resetPasswordMutation.mutateAsync({
        token,
        email,
        password: values.password,
      });

      if (response.isError) {
        toast.error(response.message || t("passwordResetFailed"));
        return;
      }

      toast.success(t("passwordResetSuccess"));
      router.push(redirectPath);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Loader isLoading={resetPasswordMutation.isPending}></Loader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
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

          <Button disabled={isSubmitting} type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      <div className="text-xs text-center text-gray-500 mt-6">
        © 2025 Property Explorer, Qatar. All Rights Reserved
      </div>
    </>
  );
}
