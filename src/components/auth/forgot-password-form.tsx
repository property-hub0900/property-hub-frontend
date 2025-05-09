"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { getErrorMessage } from "@/utils/utils";
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
  //const [isSubmitting, setIsSubmitting] = useState(false);

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
    //setIsSubmitting(true);
    try {
      await requestResetMutation.mutateAsync(values.email as any);
      toast.success(t("passwordResetEmailSent"));
      router.push(`${redirectPath}?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    //  finally {
    //  // setIsSubmitting(false);
    // }
  };

  return (
    <>
      <Loader isLoading={requestResetMutation.isPending}></Loader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel className="text-sm">{t("form.email.label")}</FormLabel>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("form.email.placeholder")}
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

          <Button
            disabled={requestResetMutation.isPending}
            type="submit"
            className="w-full"
          >
            {t("next")}
          </Button>
        </form>
      </Form>

    </>
  );
}
