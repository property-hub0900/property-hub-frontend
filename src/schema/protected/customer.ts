import { z } from "zod";
import { commonValidations } from "../commonValidations";

export const customerProfileSchema = (t: (key: string) => string) =>
  z.object({
    firstName: commonValidations.stringRequired(t("form.required")),
    lastName: commonValidations.stringRequired(t("form.required")),
    email: commonValidations.stringRequired(t("form.required")),
    phoneNumber: commonValidations.stringRequired(t("form.required")),
    profilePhoto: z.string().optional().nullable(),
  });

export type TCustomerProfileSchema = z.infer<
  ReturnType<typeof customerProfileSchema>
>;

export const changePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      //email: commonValidations.stringRequired(t("form.required")),
      currentPassword: commonValidations.stringRequired(t("form.required")),
      password: z
        .string({ required_error: t("form.password.errors.required") })
        .min(8, {
          message: t("form.password.errors.invalid"),
        }),
      confirmPassword: z
        .string({ required_error: t("form.confirmPassword.errors.required") })
        .min(8, {
          message: t("form.confirmPassword.errors.invalid"),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("form.confirmPassword.errors.mismatch"),
      path: ["confirmPassword"],
    });

export type TChangePasswordSchema = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
