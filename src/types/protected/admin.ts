export interface IAdminCustomersResponse {
  results: IAdminCustomer[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}

export interface IAdminCustomer {
  customerId: number;
  firstName: string;
  lastName: string;
  createdAt: string;
  user: {
    email: string;
    status: boolean;
  };
}
