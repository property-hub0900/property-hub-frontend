export interface ICustomerProfile {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePhoto?: string | null;
  firebaseToken?: string;
  userId?: number;
}

export interface IChangePassword {
  email: string;
  currentPassword: string;
  password: string;
}
