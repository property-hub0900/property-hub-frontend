import { z } from "zod";
import { commonValidations } from "../commonValidations";

export const saveSearchSchema = (t: (key: string) => string) =>
  z.object({
    searchTitle: commonValidations.stringRequired(t("form.required")),
  });

export type TSaveSearchSchema = z.infer<ReturnType<typeof saveSearchSchema>>;

export const contactUsSchema = (t: (key: string) => string) =>
  z.object({
    firstName: commonValidations.stringRequired(t("form.required")),
    lastName: commonValidations.stringRequired(t("form.required")),
    email: commonValidations.email(
      t("form.required"),
      t("form.email.errors.invalid")
    ),
    phone: commonValidations
      .stringRequired(t("form.required"))
      .min(5, { message: t("form.phoneNumber.errors.invalid") })
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
        message: t("form.phoneNumber.errors.invalid"),
      }),
    purpose: commonValidations.stringRequired(t("form.required")),
    propertyType: commonValidations.stringRequired(t("form.required")),
    locationPreference: commonValidations.stringRequired(t("form.required")),
    budget: commonValidations.stringRequired(t("form.required")),
    message: commonValidations.stringRequired(t("form.required")),
  });

export type TContactUsSchema = z.infer<ReturnType<typeof contactUsSchema>>;
