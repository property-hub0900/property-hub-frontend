export const PROPERTY_CATEGORIES = ["Residential", "Commercial"] as const;
export type TPropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

export const PROPERTY_PURPOSE = ["For Sale", "For Rent"] as const;
export type TPropertyPurpose = (typeof PROPERTY_PURPOSE)[number];

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Office",
  "Shop",
  "Warehouse",
  "Land",
] as const;

export type TPropertyType = (typeof PROPERTY_TYPES)[number];
