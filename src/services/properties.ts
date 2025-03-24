import apiClient from "@/lib/api-client";
import { buildQueryString } from "@/lib/utils";
import { PropertyFilters, PropertyResponse } from "@/types/client/properties";

// export const fetchProperties = (): Promise<IProperties> => {
//   return apiClient.get(`/properties`);
// };

export async function fetchProperties(
  filters: PropertyFilters
): Promise<PropertyResponse> {
  const queryString = buildQueryString(filters);
  return apiClient.get(`/properties?${queryString}`);
}
