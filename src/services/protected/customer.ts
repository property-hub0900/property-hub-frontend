import apiClient from "@/lib/api-client";
import { ICommonMessageResponse, IListResponse } from "@/types/common";
import {
  IChangePassword,
  ICustomerGetMe,
  INotification,
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
  notification: async (
    pageSize: number = 10000
  ): Promise<IListResponse<INotification>> => {
    return apiClient.get(`/customers/notification?page=0&pageSize=${pageSize}`);
  },
  notificationMarkAsRead: async (
    notificationId: number
  ): Promise<ICommonMessageResponse> => {
    return apiClient.put(`/customers/read-notification/${notificationId}`);
  },
  notificationMarkAllAsRead: async (): Promise<ICommonMessageResponse> => {
    return apiClient.put(`/customers/notifications-read`);
  },
};
