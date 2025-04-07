import apiClient from "@/lib/api-client";
import { buildQueryString } from "@/utils/utils";
import {
  IProperty,
  IPropertyFilters,
  IPropertyResponse,
} from "@/types/client/properties";

export const propertyServices = {
  fetchProperties(filters: IPropertyFilters): Promise<IPropertyResponse> {
    return apiClient.get(
      `/properties?status=published&${buildQueryString(filters)}`
    );
  },
  getPropertyById: async (id: string): Promise<IProperty> => {
    return apiClient.get(`/properties/${id}`);
  },

  getSimilarProperties: async (id: string) => {
    return apiClient.get(`/properties/${id}/similar`);
  },
};
