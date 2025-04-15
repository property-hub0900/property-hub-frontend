import apiClient from "@/lib/api-client";
import { ICommonMessageResponse } from "@/types/common";
import { IChangePassword, ICustomerProfile } from "@/types/protected/customer";

// Customer service with methods for customer operations
export const customerService = {
  // Get current customer data
  getMe: async () => {
    return apiClient.get("/customer/me");
  },
  getCustomerProfile: async (id: number): Promise<ICustomerProfile> => {
    return apiClient.get(`/customers/${id}`);
  },
  updateCustomerProfile: async (
    payloads: ICustomerProfile & { id: number }
  ): Promise<ICommonMessageResponse> => {
    return apiClient.put(`/customers/${payloads.id}`, payloads);
  },
  changePassword: async (
    payloads: IChangePassword
  ): Promise<ICommonMessageResponse> => {
    return apiClient.post(`/userAuth/change-password`, payloads);
  },
};
