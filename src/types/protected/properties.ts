import { TPropertyStatuses } from "@/constants/constants";
import { createPropertySchema } from "@/schema/protected/properties";
import { z } from "zod";

export type TCreatePropertySchema = z.infer<
  ReturnType<typeof createPropertySchema>
>;

export interface IProperties {
  isError: false;
  page: 0;
  pageSize: 20;
  results: IProperty[];
  total: 0;
}

export interface IProperty {
  referenceNo: string;
  propertyId: number;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  purpose: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: TPropertyStatuses;
  featured: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: string;
  postedBy: string;
  companyId: string;
  createdAt: string;
  PropertyImages: IPropertyImage[];
}

interface IPropertyImage {
  imageId: number;
  propertyId: number;
  url: string;
  isPrimary: boolean;
}

export interface IAmenity {
  amenityId: number;
  name: string;
  icon: string;
  amenityLabel: string;
}

export interface IAmenitiesResponse {
  results: IAmenity[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}

export interface ISavedSearches {
  isError: false;
  page: 0;
  pageSize: 20;
  results: ISavedSearch[];
  total: 0;
}

export interface ISavedSearch {
  searchId: number;
  customerId: number;
  searchTitle: string;
  searchQuery: string;
  createdAt: string;
}

export interface IStaffListResponse {
  results: IStaffList[];
}

export interface IStaffList {
  staffId: string;
  firstName: string;
  lastName: string;
}
