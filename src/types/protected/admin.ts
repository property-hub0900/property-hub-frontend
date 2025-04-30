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
  pointsPerDuration: number | null;
  pricePerDuration: number | null;
  contractExpiryDate: Date | null;
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
  contractExpiryDate: Date | null;
  pointsPerDuration: number | null;
  pricePerDuration: number | null;
}

export interface IAddCompanyPoints {
  points: number;
  type: string;
  description: string;
}

export interface IAdminProperty {
  propertyId: number;
  referenceNo: string;
  title: string;
  price: number;
  propertyType: string;
  status: string;
  featured: boolean;
  company: {
    companyId: number;
    companyName: string;
  };
}

export interface IAdminSubscription {
  subscriptionId: number;
  companyId: number;
  points: number;
  status: string | null;
  paymentMethod: string | null;
  paymentImage: string | null;
  type: string | null;
  price: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  company: {
    companyId: number;
    companyName: string;
    companyEmail: string;
    companyPhone: string | null;
  };
}

export interface IAdminPoints {
  transactionId: number;
  companyId: number;
  companyName: string;
  points: number;
  status: "approved" | "pending" | "rejected"; // adjust as needed
  archivedays: number | null;
  paymentMethod: "card" | "cash" | "bank" | string | null; // extend if needed
  email: string | null;
  phoneNumber: string | null;
  message: string | null;
  type: "topup" | "refund" | string; // adjust if there are other types
  description: string;
  propertyId: number | null;
  createdAt: string; // ISO date string
}

export interface IGetAdminChartReports {
  name: string;
  count: number;
}

export interface IGetAdminStatsReport {
  propertyCount: number;
  companyCount: number;
  customerCount: number;
  subscriptionCount: number;
}
