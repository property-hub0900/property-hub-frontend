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

export interface IUpdate<T> {
  id: string;
  payload: T;
}

export interface IListResponse<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}
