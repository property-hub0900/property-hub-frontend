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

export const PROPERTY_OWNERSHIP_STATUS = ["FreeHold", "Non-FreeHold"] as const;
export type TPropertyOwnershipStatus =
  (typeof PROPERTY_OWNERSHIP_STATUS)[number];

export const PROPERTY_OCCUPANCY = [
  "Vacant",
  "Occupied",
  "Will be vacated soon",
] as const;
export type TPropertyOccupancy = (typeof PROPERTY_OCCUPANCY)[number];

export const PROPERTY_FURNISHED_TYPE = [
  "Furnished",
  "Semi-Furnished",
  "Unfurnished",
] as const;
export type TPropertyFurnishedType = (typeof PROPERTY_FURNISHED_TYPE)[number];

export const PROPERTY_VIEWS = [
  "Sea View",
  "City View",
  "Park View",
  "Other",
] as const;
export type TPropertyViews = (typeof PROPERTY_VIEWS)[number];
