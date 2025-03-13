import { z } from "zod";
import { commonValidations } from "../commonValidations";

export const createPropertySchema = (t: (key: string) => string) =>
  z.object({
    title: commonValidations.stringRequired(t("form.title.errors.required")),
    description: commonValidations.stringRequired(
      t("form.description.errors.required")
    ),
    price: z
      .number({ required_error: t("form.price.errors.required") })
      .min(0, t("form.price.errors.invalid")),
    propertyType: commonValidations.stringRequired(
      t("form.propertyType.errors.required")
    ),
    purpose: commonValidations.stringRequired(
      t("form.purpose.errors.required")
    ),
    bedrooms: z
      .number({ required_error: t("form.bedrooms.errors.required") })
      .min(0, t("form.bedrooms.errors.invalid")),
    bathrooms: z
      .number({ required_error: t("form.bathrooms.errors.required") })
      .min(0, t("form.bathrooms.errors.invalid")),
    area: z
      .number({ required_error: t("form.area.errors.required") })
      .min(0, t("form.area.errors.invalid")),
    status: commonValidations.stringRequired(t("form.status.errors.required")),
    featured: z.boolean(),
    street: commonValidations.stringRequired(t("form.street.errors.required")),
    city: commonValidations.stringRequired(t("form.city.errors.required")),
    state: commonValidations.stringRequired(t("form.state.errors.required")),
    zipCode: commonValidations.stringRequired(
      t("form.zipCode.errors.required")
    ),
    location: commonValidations.stringRequired(t("form.required")),
    country: commonValidations.stringRequired(
      t("form.country.errors.required")
    ),
    amenities: z
      .array(z.number())
      .nonempty(t("form.amenities.errors.required")),
    images: z.array(
      z.object({
        isPrimary: z.boolean(),
        url: commonValidations.stringRequired(t("form.images.errors.required")),
      })
    ),
  });
