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

  getFavoriteProperties(filters: IPropertyFilters): Promise<IPropertyResponse> {
    return apiClient.get(
      `/customers/favorite-properties?status=published&${buildQueryString(
        filters
      )}`
    );
  },
  getSaveSearched(id: number): Promise<ISavedSearches> {
    return apiClient.get(`/customers/save-search?&page=0&pageSize=100000`);
  },
  deleteSaveSearch(id: number): Promise<ICommonMessageResponse> {
    return apiClient.delete(`/customers/remove-search/${id}`);
  },
};
