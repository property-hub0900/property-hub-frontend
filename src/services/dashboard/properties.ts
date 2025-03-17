import apiClient from "@/lib/api-client";
import { IProperties } from "@/types/dashboard/properties";

export const companiesProperties = (): Promise<IProperties> => {
  return apiClient.get("/companies/properties?role=self");
};
