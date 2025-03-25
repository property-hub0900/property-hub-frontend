import apiClient from "@/lib/api-client";

export const propertyService = {
  getPropertiesBy: async (params: any) => {
    return apiClient.get(`/properties`, {
      params,
    });
  },

  getPropertyById: async (id: string) => {
    return apiClient.get(`/properties/${id}`);
  },

  getSimilarProperties: async (id: string) => {
    return apiClient.get(`/properties/${id}/similar`);
  },
};
