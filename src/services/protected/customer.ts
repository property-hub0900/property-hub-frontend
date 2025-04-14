import apiClient from "@/lib/api-client";

import { IPropertyFilters, IPropertyResponse } from "@/types/public/properties";
import { buildQueryString } from "@/utils/utils";
import { ISavedSearches } from "@/types/protected/customer";
import { ICommonMessageResponse } from "@/types/common";

// Customer service with methods for customer operations
export const customerService = {
  // Get current customer data
  getMe: async () => {
    return apiClient.get("/customer/me");
  },
};
