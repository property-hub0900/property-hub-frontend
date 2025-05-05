import { z, ZodType } from "zod";

type NumberRequiredValidator = (
  requiredErrorMessage: string,
  invalidErrorMessage?: string
) => ZodType<number>;

export const commonValidations = {
  stringRequired: (requiredErrorMessage: string) =>
    z
      .string({ required_error: requiredErrorMessage })
      .trim()
      .min(1, { message: requiredErrorMessage }),
  stringOptional: () => z.string().trim().optional().or(z.literal("")),
  numberRequired: (requiredErrorMessage: string, invalidErrorMessage: string) =>
    z.coerce
      .number({
        required_error: requiredErrorMessage,
        invalid_type_error: invalidErrorMessage,
      })
      .min(1, { message: requiredErrorMessage }),
  numberOptional: (requiredErrorMessage: string) =>
    z.coerce
      .number({
        required_error: requiredErrorMessage,
        invalid_type_error: requiredErrorMessage,
      })
      .min(0, { message: requiredErrorMessage }),

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
  enumRequired: (enums, invalidErrorMessage: string) =>
    z.enum(enums, {
      required_error: invalidErrorMessage,
    }),
  enumOptional: (enums) => z.enum(enums).optional(),
};
