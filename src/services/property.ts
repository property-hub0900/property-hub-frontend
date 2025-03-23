import apiClient from "@/lib/api-client";

export const propertyService = {
  getPropertiesBy: async (params: any) => {
    return apiClient.get(`/properties`, {
      params,
    });
  },
};
