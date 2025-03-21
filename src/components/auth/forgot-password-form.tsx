"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Loader } from "../loader";

type ForgotPasswordFormProps = {
  t: any; // Translation function
  redirectPath: string;
  authService: any;
};

const createForgotPasswordSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("form.email.errors.required") })
      .email({ message: t("form.email.errors.invalid") }),
  });

export function ForgotPasswordForm({
  t,
  redirectPath,
  authService,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = createForgotPasswordSchema(t);
  type ForgotPasswordFormValues = z.infer<typeof schema>;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const requestResetMutation = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: authService.forgotPassword,
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await requestResetMutation.mutateAsync(values.email as any);
      toast.success(t("passwordResetEmailSent"));
      router.push(`${redirectPath}?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Loader isLoading={requestResetMutation.isPending}></Loader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel className="text-sm">Email</FormLabel>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      type="email"
                      {...field}
                      autoComplete="email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {t("next")}
          </Button>
        </form>
      </Form>
      <div className="text-xs text-center text-gray-500 mt-6">
        © 2025 Property Explorer, Qatar. All Rights Reserved
      </div>
    </>
  );
}
