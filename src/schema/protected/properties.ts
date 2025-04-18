import { z } from "zod";
import { commonValidations } from "../commonValidations";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_OCCUPANCY,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PURPOSE,
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
    bathrooms: commonValidations.numberRequired(t("form.required")),
    tenure: commonValidations.stringOptional(),
    ownershipStatus: commonValidations.enumOptional(PROPERTY_OWNERSHIP_STATUS),
    buildingFloors: commonValidations.numberOptional(t("form.required")),
    floor: commonValidations.numberOptional(t("form.required")),
    occupancy: commonValidations.enumOptional(PROPERTY_OCCUPANCY),
    furnishedType: z.string().trim().nullable(),
    views: commonValidations.stringOptional(),
    serviceCharges: commonValidations.stringOptional(),
    price: commonValidations.numberRequired(t("form.required")),
    priceVisibilityFlag: z.boolean().optional(),
    //city: commonValidations.stringRequired(t("form.required")),
    address: commonValidations.stringRequired(t("form.required")),
    amenities: z.array(z.string()).min(1, t("form.required")),
    referenceNo: commonValidations.stringRequired(t("form.required")),
    description: commonValidations.stringRequired(t("form.required")),
    descriptionAr: commonValidations.stringRequired(t("form.required")),
    featured: z.boolean().optional(),
    status: commonValidations.stringRequired(t("form.required")),
    // PropertyImages: z.array(
    //   z
    //     .object({
    //       url: z.string(), // Required field
    //     })
    //     .optional()
    // ),
    PropertyImages: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL"),
        })
      )
      .min(1, "At least one image is required")
      .max(20, `Maximum 20 images allowed`),
  });

export const propertyDataFIltersSchema = (t: (key: string) => string) =>
  z.object({
    publisher: commonValidations.stringOptional(),
    featured: commonValidations.stringOptional(),
    propertyType: commonValidations.stringOptional(),
    status: commonValidations.stringOptional(),
  });

export type TPropertyDataFIltersSchema = z.infer<
  ReturnType<typeof propertyDataFIltersSchema>
>;
