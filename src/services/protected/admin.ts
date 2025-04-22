import apiClient from "@/lib/api-client";
import {
  ICompanyAdmin,
  ICustomerAdmin,
  IEditCompanyGet,
  IEditCompanyUpdate,
} from "@/types/protected/admin";
import { ICommonMessageResponse, IListResponse } from "@/types/common";

// Customer service with methods for customer operations
export const adminServices = {
  adminCustomers: async (): Promise<IListResponse<ICustomerAdmin>> => {
    return apiClient.get(`/admin/customers?page=0&pageSize=10000`);
  },
  adminCompanies: async (): Promise<IListResponse<ICompanyAdmin>> => {
    return apiClient.get(`/admin/companies?page=0&pageSize=10000`);
  },
  getAdminCompany: async (companyId: number): Promise<IEditCompanyGet> => {
    return apiClient.get(`/admin/companies/${companyId}`);
  },
  updateAdminCompany: async (payloads: {
    companyId: number;
    data: IEditCompanyUpdate;
  }): Promise<ICommonMessageResponse> => {
    return apiClient.put(
      `/admin/companies/${payloads.companyId}`,
      payloads.data
    );
  },
};
