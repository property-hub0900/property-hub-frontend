/* eslint-disable no-unused-vars */
import { z } from "zod";
import { commonValidations } from "./commonValidations";

export const userAuthStaffRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: commonValidations.stringRequired(
        t("form.firstName.errors.required")
      ),
      lastName: commonValidations.stringRequired(
        t("form.lastName.errors.required")
      ),
      email: commonValidations.email(
        t("form.email.errors.required"),
        t("form.email.errors.invalid")
      ),
      companyEmail: commonValidations.email(
        t("form.companyEmail.errors.required"),
        t("form.companyEmail.errors.invalid")
      ),
      companyName: commonValidations.stringRequired(
        t("form.companyName.errors.required")
      ),
      phoneNumber: commonValidations.stringRequired(
        t("form.phoneNumber.errors.required")
      ),
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

export const useAuthCustomerRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: commonValidations
        .stringRequired(t("form.firstName.errors.required"))
        .min(2, { message: t("form.firstName.errors.min") })
        .max(50, { message: t("form.firstName.errors.max") }),

      lastName: commonValidations
        .stringRequired(t("form.lastName.errors.required"))
        .min(2, { message: t("form.lastName.errors.min") })
        .max(50, { message: t("form.lastName.errors.max") }),

      email: commonValidations.email(
        t("form.email.errors.required"),
        t("form.email.errors.invalid")
      ),

      phone: commonValidations
        .stringRequired(t("form.phoneNumber.errors.required"))
        .min(5, { message: t("form.phoneNumber.errors.invalid") })
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
          message: t("form.phoneNumber.errors.invalid"),
        }),

      password: z
        .string({ required_error: t("form.password.errors.required") })
        .min(8, { message: t("form.password.errors.min") })
        .regex(/[A-Z]/, { message: t("form.password.errors.uppercase") })
        .regex(/[a-z]/, { message: t("form.password.errors.lowercase") })
        .regex(/[0-9]/, { message: t("form.password.errors.number") }),

      confirmPassword: z.string({
        required_error: t("form.confirmPassword.errors.required"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("form.confirmPassword.errors.mismatch"),
      path: ["confirmPassword"],
    });

export const userAuthCustomerLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: commonValidations.email(
      t("form.email.errors.required"),
      t("form.email.errors.invalid")
    ),
    password: z
      .string({ required_error: t("form.password.errors.required") })
      .min(8, {
        message: t("form.password.errors.invalid"),
      }),
    rememberMe: z.boolean().default(false),
  });

export const userAuthStaffLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: commonValidations.email(
      t("form.email.errors.required"),
      t("form.email.errors.invalid")
    ),
    password: z
      .string({ required_error: t("form.password.errors.required") })
      .min(8, {
        message: t("form.password.errors.invalid"),
      }),
    rememberMe: z.boolean().default(false),
  });

export const verificationSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({
      message: t("form.email.errors.invalid"),
    }),
    otp: z
      .string()
      .length(6, { message: t("form.otp.errors.length") })
      .regex(/^\d+$/, { message: t("form.otp.errors.format") }),
  });

export type TVerificationSchema = z.infer<
  ReturnType<typeof verificationSchema>
>;
