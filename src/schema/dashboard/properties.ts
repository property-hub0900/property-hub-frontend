/* eslint-disable no-unused-vars */
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
    furnishedType: z.string().trim().nullable(),
    views: commonValidations.stringOptional(),
    serviceCharges: commonValidations.stringOptional(),
    price: commonValidations.numberRequired(t("form.required")),
    priceVisibilityFlag: z.boolean().optional(),
    //city: commonValidations.stringRequired(t("form.required")),
    address: commonValidations.stringRequired(t("form.required")),
    amenities: z.array(z.string()).optional(),
    referenceNo: commonValidations.stringOptional(),
    description: commonValidations.stringRequired(t("form.required")),
    descriptionAr: commonValidations.stringRequired(t("form.required")),
    featured: z.boolean().optional(),
    status: commonValidations.stringRequired(t("form.required")),
    PropertyImages: z.array(
      z.object({
        url: z.string(), // Required field
        path: z.string(), // Required field
      })
    ),
  });
