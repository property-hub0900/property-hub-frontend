import { createPropertySchema } from "@/schema/dashboard/properties";
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
  propertyId: number;
  title: string;
  description: string;
  price: string;
  propertyType: string;
  purpose: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: string;
  featured: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: Location;
  postedBy: any;
  companyId: any;
  createdAt: string;
  PropertyImages: IPropertyImage[];
}

interface IPropertyLocation {
  crs: string;
  type: string;
  coordinates: [number, number];
}

interface IPropertyCRS {
  type: string;
  properties: { name: string };
}

interface IPropertyImage {
  imageId: number;
  propertyId: number;
  url: string;
  isPrimary: boolean;
}
