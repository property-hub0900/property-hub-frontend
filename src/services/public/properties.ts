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
    return apiClient.get(
      `/properties?status=published&sortBy=newest&page=0&pageSize=10`
    );
  },

  getSimilarProperties(propertyType: string): Promise<IPropertyResponse> {
    return apiClient.get(
      `/properties?status=published&propertyType=${propertyType}&sortBy=featured&page=0&pageSize=10`
    );
  },

  postFavorites(payloads: {
    type: "add" | "remove";
    propertyId: number;
  }): Promise<ICommonMessageResponse> {
    return apiClient.post(`/customers/favorites`, payloads);
  },

  customerSaveSearch(payloads: {
    searchTitle: string;
    searchQuery: string;
  }): Promise<ICommonMessageResponse> {
    return apiClient.post(`/customers/save-search`, payloads);
  },
};
