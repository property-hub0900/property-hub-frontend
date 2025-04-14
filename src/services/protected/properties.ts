import apiClient from "@/lib/api-client";
import { ICommonMessageResponse, IUpdate } from "@/types/common";
import { ISavedSearches } from "@/types/protected/customer";

import {
  IAmenitiesResponse,
  IProperties,
  IProperty,
  TCreatePropertySchema,
} from "@/types/protected/properties";
import { IPropertyFilters, IPropertyResponse } from "@/types/public/properties";
import { buildQueryString } from "@/utils/utils";

export const companiesProperties = (role: string): Promise<IProperties> => {
  return apiClient.get(`/companies/properties?role=${role}`);
};

export const createProperty = (
  payloads: TCreatePropertySchema
): Promise<ICommonMessageResponse> => {
  return apiClient.post("/properties", payloads);
};

export const getPropertyById = (id: string): Promise<IProperty> => {
  return apiClient.get(`/companies/properties/${id}`);
};

export const updatePropertyById = ({
  id,
  payload,
}: IUpdate<
  Partial<TCreatePropertySchema>
>): Promise<ICommonMessageResponse> => {
  return apiClient.put(`/properties/${id}`, payload);
};

export const deletePropertyById = (
  id: number
): Promise<ICommonMessageResponse> => {
  return apiClient.delete(`/properties/${id}`);
};

export const amenities = (): Promise<IAmenitiesResponse> => {
  return apiClient.get("/amenities?page=0&pageSize=100000");
};

export const getFavoriteProperties = (
  filters: IPropertyFilters
): Promise<IPropertyResponse> => {
  return apiClient.get(
    `/customers/favorite-properties?status=published&${buildQueryString(
      filters
    )}`
  );
};

export const getSaveSearched = (id: number): Promise<ISavedSearches> => {
  return apiClient.get(`/customers/save-search?&page=0&pageSize=100000`);
};

export const deleteSaveSearch = (
  id: number
): Promise<ICommonMessageResponse> => {
  return apiClient.delete(`/customers/remove-search/${id}`);
};
