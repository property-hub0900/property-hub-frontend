import apiClient from "@/lib/api-client";

import { IAdminCustomersResponse } from "@/types/protected/admin";

// Customer service with methods for customer operations
export const adminServices = {
  adminCustomers: async (): Promise<IAdminCustomersResponse> => {
    return apiClient.get(`/admin/customers?page=0&pageSize=10000`);
  },
};
