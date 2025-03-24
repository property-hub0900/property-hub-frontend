export interface PropertyResponse {
  results: ClientProperty[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}

export interface ClientProperty {
  propertyId: number;
  title: string;
  titleAr: string;
  category: string;
  tenure: string;
  ownershipStatus: string;
  buildingFloors: number;
  floor: number;
  occupancy: string;
  furnishedType: string | null;
  views: string;
  serviceCharges: string;
  propertySize: string;
  description: string;
  descriptionAr: string;
  price: string;
  hidePrice: string | null;
  propertyType: string;
  purpose: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  featured: boolean;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  location: string | null;
  postedBy: number;
  companyId: number;
  referenceNo: string;
  createdAt: string;
  PropertyImages: PropertyImage[];
}

export interface PropertyImage {
  imageId: number;
  propertyId: number;
  url: string;
  isPrimary: boolean;
}

export interface PropertyFilters {
  location?: string;
  rent?: string;
  propertyType?: string;
  bedsAndBath?: string;
  price?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
