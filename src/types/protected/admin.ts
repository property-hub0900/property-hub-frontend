export interface ICustomerAdmin {
  customerId: number;
  firstName: string;
  lastName: string;
  createdAt: string;
  user: {
    email: string;
    status: boolean;
  };
}

export interface ICompanyAdmin {
  companyId: number;
  name: string;
  status: "active" | "inactive";
  email: string;
  sharedPoints: number;
  phone: string;
  createdAt: string; // ISO date string
  listingCount: number;
  leadCount: number;
}

export interface IEditCompanyGet {
  companyId: number;
  name: string;
  email: string;
  phone: string | null;
  website?: string | null;
  sharedPoints: number;
  status: "active" | "inactive" | "rejected" | string;
  //subscriptionStartDate: string | null;
  //subscriptionEndDate: string | null;
  companySize: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  country?: string | null;
  postalCode: string | null;
  createdAt?: string;
  CompanyContract: ICompanyContract;
}

export interface ICompanyContract {
  pointsPerDuration: string | null;
  pricePerDuration: string | null;
  contractExpiryDate: string | null;
}

export interface IEditCompanyUpdate {
  name: string;
  email: string;
  phone: string | null;
  website?: string | null;
  status: "active" | "inactive" | "rejected" | string;
  street: string | null;
  city: string | null;
  state: string | null;
  country?: string | null;
  postalCode: string | null;
  contractExpiryDate: string | null;
  pointsPerDuration: string | null;
  pricePerDuration: string | null;
}
