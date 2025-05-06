export interface IPropertyResponse {
  results: IProperty[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}

export interface IProperty {
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
  price: number;
  hidePrice: boolean;
  propertyType: string;
  purpose: string;
  bedrooms?: number;
  bathrooms: number;
  status: string;
  featured: boolean;
  street: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  location: string | null;
  postedBy: number;
  companyId: number;
  referenceNo: string;
  created_at: string;
  PropertyImages: IPropertyImages[];
  postedByStaff: IPostedByStaff;
  company: IPropertyCompany;
  PropertyAmenities: IPropertyAmenities[];
  is_favorite: boolean;
  rentalPeriod?: string;
  availableFrom?: string;
}

export interface IPostedByStaff {
  staffId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userId: number;
  companyId: number;
  role: string;
  profilePhoto: string | null;
  biography: string | null;
  languagesSpoken: string;
  active: boolean;
  isOwner: boolean;
  createdAt: string;
  user: IPostedByStaffUser;
}

export interface IPostedByStaffUser {
  email: string;
}

export interface IPropertyImages {
  // imageId: number;
  // propertyId: number;
  url: string;
  //isPrimary: boolean;
}

export interface IPropertyCompany {
  companyId: number;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  logo: string | null;
}

export interface IPropertyAmenities {
  propertyAmenityId: number;
  propertyId: number;
  amenityId: number;
  Amenity: IAmenity;
}
interface IAmenity {
  amenityId: number;
  name: string;
  nameAr: string | null;
  icon: string;
}

export interface IPropertyFilters {
  searchQuery?: string;
  propertyType?: string;
  furnishedType?: string[];
  purpose?: string;
  bedrooms?: string;
  bathrooms?: string;
  priceMin?: string;
  priceMax?: string;
  amenitiesIds?: string[];
  propertySizeMin?: string;
  propertySizeMax?: string;
  keywords?: string;
  companyId?: string;
  page?: string;
  pageSize?: string;
  sortBy?: string;
  address?: string;
  rentalPeriod?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ICompanyFilters {
  name?: string;
  page?: string;
  pageSize?: string;
}

export interface ICompany {
  companyId: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  website: string;
  logo: string;
  taxNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  listingCount: number;
  rentedProperties: number;
  saledProperties: number;
  createdAt: Date | string;
}
