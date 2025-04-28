import apiClient from "@/lib/api-client";
import {
  ICompanyAdmin,
  ICustomerAdmin,
  IEditCompanyGet,
  IEditCompanyUpdate,
  IAddCompanyPoints,
  IAdminProperty,
  IAdminSubscription,
  IAdminPoints,
} from "@/types/protected/admin";
import { ICommonMessageResponse, IListResponse, IOption } from "@/types/common";

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
  addCompanyPoints: async (payloads: {
    companyId: number;
    data: IAddCompanyPoints;
  }): Promise<ICommonMessageResponse> => {
    return apiClient.post(
      `/admin/companies/points/${payloads.companyId}`,
      payloads.data
    );
  },
  getAdminProperties: async (): Promise<IListResponse<IAdminProperty>> => {
    return apiClient.get(`/admin/properties`);
  },
  getAdminSubscriptionsPlansApproved: async (): Promise<
    IListResponse<IAdminSubscription>
  > => {
    return apiClient.get(`/admin/subscriptions?status=approved`);
  },
  getAdminSubscriptionsRenewalRequestsPending: async (): Promise<
    IListResponse<IAdminSubscription>
  > => {
    return apiClient.get(`/admin/subscriptions?status=pending`);
  },
  getAdminCompanyList: async (): Promise<IListResponse<IOption>> => {
    return apiClient.get(`/admin/companies/select?page=0&pageSize=999`);
  },
  getAdminPoints: async (): Promise<IListResponse<IAdminPoints>> => {
    return apiClient.get(`/admin/points`);
  },
  approveTopUpPoints: async (
    transactionId: number
  ): Promise<ICommonMessageResponse> => {
    return apiClient.put(`/admin/subscriptions/approve-topup/${transactionId}`);
  },
  approveRenewalSubscription: async (
    subscriptionId: number
  ): Promise<ICommonMessageResponse> => {
    return apiClient.put(
      `/admin/subscriptions/approve-subscription/${subscriptionId}`
    );
  },
};
