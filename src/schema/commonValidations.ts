import { z } from "zod";

export const commonValidations = {
  stringRequired: (requiredErrorMessage: string) =>
    z
      .string({ required_error: requiredErrorMessage })
      .trim()
      .min(1, { message: requiredErrorMessage }),
  numberRequired: (requiredErrorMessage: string) =>
    z.coerce
      .number({ required_error: requiredErrorMessage })
      .min(1, { message: requiredErrorMessage }),
  numberOptional: (requiredErrorMessage: string) =>
    z.coerce
      .number({ required_error: requiredErrorMessage })
      .min(0, { message: requiredErrorMessage }),
  // numberRequired: (requiredErrorMessage: string) =>
  //   z
  //     .number({ required_error: requiredErrorMessage })
  //     .min(1, { message: requiredErrorMessage }),

  email: (requiredErrorMessage: string, invalidErrorMessage: string) =>
    z
      .string({ required_error: requiredErrorMessage })
      .trim()
      .email({ message: invalidErrorMessage }),
  emailOptional: (invalidErrorMessage: string) =>
    z
      .string()
      .email({ message: invalidErrorMessage })
      .optional()
      .or(z.literal("")),
};
