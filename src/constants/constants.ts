export const PROPERTY_CATEGORIES = ["Residential", "Commercial"] as const;
export type TPropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

export const PROPERTY_PURPOSE = ["For Sale", "For Rent"] as const;
export type TPropertyPurpose = (typeof PROPERTY_PURPOSE)[number];

export const PROPERTY_TYPES = {
  Residential: ["Apartment", "Villa", "Townhouse", "Penthouse"],
  Commercial: ["Office", "Shop", "Warehouse", "Land"],
} as const;

export type TPropertyType =
  (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES][number];

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

export const PROPERTY_STATUSES = {
  draft: "draft",
  published: "published",
  pending: "pending",
  closed: "closed",
  archived: "archived",
} as const;

export type TPropertyStatuses = keyof typeof PROPERTY_STATUSES;

export const PROPERTY_SORT_BY = {
  featured: "featured",
  newest: "newest",
  priceLow: "priceLow",
  priceHigh: "priceHigh",
} as const;

export type TPropertySortBy = keyof typeof PROPERTY_SORT_BY;
