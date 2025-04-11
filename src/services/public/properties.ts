import apiClient from "@/lib/api-client";
import { buildQueryString } from "@/utils/utils";
import {
  IProperty,
  IPropertyFilters,
  IPropertyResponse,
} from "@/types/public/properties";
import { ICommonMessageResponse } from "@/types/common";

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
  postFavorites(payloads: {
    type: "add" | "remove";
    propertyId: number;
  }): Promise<ICommonMessageResponse> {
    return apiClient.post(`/customers/favorites`, payloads);
  },
};
