import apiClient from "@/lib/api-client";
import { ICommonMessageResponse } from "@/types/common";
import {
  IChangePassword,
  ICustomerGetMe,
  IUpdateCustomerProfile,
} from "@/types/protected/customer";

// Customer service with methods for customer operations
export const customerService = {
  // Get current customer data
  getMe: async (): Promise<ICustomerGetMe> => {
    return apiClient.get("/customers/me");
  },

  updateCustomerProfile: async (
    payloads: IUpdateCustomerProfile
  ): Promise<ICommonMessageResponse> => {
    return apiClient.put(`/customers/update-profile`, payloads);
  },
  changePassword: async (
    payloads: IChangePassword
  ): Promise<ICommonMessageResponse> => {
    return apiClient.post(`/userAuth/change-password`, payloads);
  },
};
