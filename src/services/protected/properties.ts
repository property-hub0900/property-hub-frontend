import apiClient from "@/lib/api-client";
import { ICommonMessageResponse, IUpdate } from "@/types/common";
import {
  IAmenitiesResponse,
  IProperties,
  IProperty,
  TCreatePropertySchema,
} from "@/types/protected/properties";

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
