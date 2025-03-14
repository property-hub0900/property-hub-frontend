import { z } from "zod";
import { commonValidations } from "../commonValidations";
import { PROPERTY_CATEGORIES, PROPERTY_PURPOSE } from "@/constants/constants";

export const createPropertySchema = (t: (key: string) => string) =>
  z.object({
    featured: z.boolean(),
    title: commonValidations.stringRequired(t("form.required")),
    propertyCategory: z.enum(PROPERTY_CATEGORIES),
    purpose: z.enum(PROPERTY_PURPOSE),
    propertyType: commonValidations.stringRequired(t("form.required")),
    propertySize: commonValidations.stringRequired(t("form.required")),
    bedrooms: commonValidations.numberRequired(t("form.required")),
    bathrooms: commonValidations.numberRequired(t("form.required")),
    furnishedType: commonValidations.stringRequired(t("form.required")),
    price: commonValidations.numberRequired(t("form.required")),
    buildYear: commonValidations.stringRequired(t("form.required")),
    location: commonValidations.stringRequired(t("form.required")),
    description: commonValidations.stringRequired(t("form.required")),
    amenities: z.array(z.number()).optional(),
    // images: z.array(
    //   z.object({
    //     isPrimary: z.boolean(),
    //     url: z.string().url(t("form.images.urlInvalid")),
    //   })
    // ),
  });
