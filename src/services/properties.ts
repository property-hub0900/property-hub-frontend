import apiClient from "@/lib/api-client";
import { buildQueryString } from "@/utils/utils";
import { IPropertyFilters, IPropertyResponse } from "@/types/client/properties";

// export const fetchProperties = (): Promise<IProperties> => {
//   return apiClient.get(`/properties`);
// };

export async function fetchProperties(
  filters: IPropertyFilters
): Promise<IPropertyResponse> {
  return apiClient.get(
    `/properties?status=published&${buildQueryString(filters)}`
  );
}
