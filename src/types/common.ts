import { inter } from "@/lib/fonts";

export interface IResponse<T> {
  message: string;
  data?: T;
}

export interface IOption {
  value: string;
  label: string;
}

export interface ICommonMessageResponse {
  message: string;
}
