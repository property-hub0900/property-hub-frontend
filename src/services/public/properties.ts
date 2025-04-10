import apiClient from "@/lib/api-client";
import { buildQueryString } from "@/utils/utils";
import {
  IProperty,
  IPropertyFilters,
  IPropertyResponse,
} from "@/types/public/properties";

export const propertyServices = {
  fetchProperties(filters: IPropertyFilters): Promise<IPropertyResponse> {
    return apiClient.get(
      `/properties?status=published&${buildQueryString(filters)}`
    );
  },
  getPropertyById: async (id: string): Promise<IProperty> => {
    return apiClient.get(`/properties/${id}`);
  },

  getLandingLatestProperties(): Promise<IPropertyResponse> {
    return apiClient.get(`/properties?status=published&page=0&pageSize=10`);
  },

  getSimilarProperties(): Promise<IPropertyResponse> {
    return apiClient.get(`/properties?status=published&page=0&pageSize=10`);
  },
};
