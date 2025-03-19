import { z } from "zod";
import { commonValidations } from "../commonValidations";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_FURNISHED_TYPE,
  PROPERTY_OCCUPANCY,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_STATUSES,
} from "@/constants/constants";

export const createPropertySchema = (t: (key: string) => string) =>
  z.object({
    title: commonValidations.stringRequired(t("form.required")),
    titleAr: commonValidations.stringRequired(t("form.required")),
    // category: z.enum(PROPERTY_CATEGORIES, {
    //   required_error: t("form.required"),
    // }),
    category: commonValidations.enumRequired(
      PROPERTY_CATEGORIES,
      t("form.required")
    ),
    purpose: commonValidations.enumRequired(
      PROPERTY_PURPOSE,
      t("form.required")
    ),
    propertyType: commonValidations.stringRequired(t("form.required")),
    propertySize: commonValidations.stringRequired(t("form.required")),
    bedrooms: commonValidations.numberOptional(t("form.required")),
    bathrooms: commonValidations.numberOptional(t("form.required")),
    tenure: commonValidations.stringRequired(t("form.required")),
    ownershipStatus: commonValidations.enumRequired(
      PROPERTY_OWNERSHIP_STATUS,
      t("form.required")
    ),
    buildingFloors: commonValidations.numberOptional(t("form.required")),
    floor: commonValidations.numberOptional(t("form.required")),
    occupancy: commonValidations.enumRequired(
      PROPERTY_OCCUPANCY,
      t("form.required")
    ),
    furnishedType: commonValidations.enumOptional(PROPERTY_FURNISHED_TYPE),
    views: commonValidations.stringOptional(),
    serviceCharges: commonValidations.stringOptional(),
    price: commonValidations.numberRequired(t("form.required")),
    priceVisibilityFlag: z.boolean().optional(),
    //location: commonValidations.stringRequired(t("form.required")),
    amenities: z.array(z.number()).optional(),
    description: commonValidations.stringRequired(t("form.required")),
    descriptionAr: commonValidations.stringRequired(t("form.required")),
    featured: z.boolean().optional(),
    status: commonValidations.enumRequired(
      PROPERTY_STATUSES,
      t("form.required")
    ),

    // images: z.array(
    //   z.object({
    //     isPrimary: z.boolean(),
    //     url: z.string().url(t("form.images.urlInvalid")),
    //   })
    // ),
  });
