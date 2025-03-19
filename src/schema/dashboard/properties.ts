import { z } from "zod";
import { commonValidations } from "../commonValidations";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_PURPOSE,
  PROPERTY_STATUSES,
} from "@/constants/constants";

export const createPropertySchema = (t: (key: string) => string) =>
  z.object({
    title: commonValidations.stringRequired(t("form.required")),
    titleAr: commonValidations.stringRequired(t("form.required")),
    category: z.enum(PROPERTY_CATEGORIES, {
      required_error: t("form.required"),
    }),
    purpose: commonValidations.stringRequired(t("form.required")),
    propertyType: commonValidations.stringRequired(t("form.required")),
    propertySize: commonValidations.stringRequired(t("form.required")),
    bedrooms: commonValidations.numberOptional(t("form.required")),
    bathrooms: commonValidations.numberOptional(t("form.required")),
    tenure: commonValidations.stringRequired(t("form.required")),
    ownershipStatus: commonValidations.stringRequired(t("form.required")),
    buildingFloors: commonValidations.numberOptional(t("form.required")),
    floor: commonValidations.numberOptional(t("form.required")),
    occupancy: commonValidations.stringRequired(t("form.required")),
    furnishedType: commonValidations.stringRequired(t("form.required")),
    views: commonValidations.stringRequired(t("form.required")),
    serviceCharges: commonValidations.stringRequired(t("form.required")),
    price: commonValidations.numberRequired(t("form.required")),
    priceVisibilityFlag: z.boolean().optional(),
    //location: commonValidations.stringRequired(t("form.required")),
    amenities: z.array(z.number()).optional(),
    description: commonValidations.stringRequired(t("form.required")),
    descriptionAr: commonValidations.stringRequired(t("form.required")),
    featured: z.boolean().optional(),
    status: z.enum(PROPERTY_STATUSES, {
      required_error: t("form.required"),
    }),

    // images: z.array(
    //   z.object({
    //     isPrimary: z.boolean(),
    //     url: z.string().url(t("form.images.urlInvalid")),
    //   })
    // ),
  });
