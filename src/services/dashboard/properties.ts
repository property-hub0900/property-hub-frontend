import apiClient from "@/lib/api-client";
import { IProperties } from "@/types/dashboard/properties";

export const properties = (): Promise<IProperties> => {
  return apiClient.get("/properties");
};
