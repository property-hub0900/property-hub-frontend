import { apiClient } from "@/lib/api-client";
import type {
  IContactUs,
  SocialLoginPayload,
  TCustomerLoginSchema,
  TUseAuthCustomerRegisterSchema,
  TUserAuthStaffLoginSchema,
  TUserAuthStaffRegisterSchema,
} from "@/types/public/auth";

import type { ICommonMessageResponse, IResponse } from "@/types/common";

// Types for the API requests and responses
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  token?: string;
  userId?: string;
  // Add any other fields returned by your API
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  userId?: string;
  // Add any other fields returned by your API
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  message: string;
  statusCode: number;
  error?: string;
  validation?: string;
  isError: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
}
export interface ResetPasswordResponse {
  message: string;
  statusCode: number;
  isError: boolean;
}

export const logout = (): void => {
  // Remove tokens from storage
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("userId");
  sessionStorage.removeItem("userId");

  // You might want to call a logout endpoint here if needed
  // await apiClient.post("/userAuth/logout");
};

export const authService = {
  userAuthStaffRegister: async (
    payloads: TUserAuthStaffRegisterSchema
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/staff/register", payloads);
  },

  userAuthStaffLogin: async (
    payloads: TUserAuthStaffLoginSchema
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/staff/login", payloads);
  },

  userAuthCustomerRegister: async (
    payloads: TUseAuthCustomerRegisterSchema
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/customer/register", payloads);
  },

  userAuthCustomerLogin: async (
    payloads: TCustomerLoginSchema
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/customer/login", payloads);
  },

  verifyOtp: async (
    email: string,
    otpCode: string
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/verify-otp", { email, otpCode });
  },

  resendOtp: async (email: string): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/resend-otp", { email });
  },

  customerSocialLogin: async (
    payload: SocialLoginPayload
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/customer/social-login", payload);
  },

  staffSocialLogin: async (
    payload: SocialLoginPayload
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/staff/social-login", payload);
  },

  forgotPassword: async (email: string): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/forgot-password", { email });
  },

  resetPassword: async ({
    password,
    email,
  }: ResetPasswordRequest): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/reset-password", {
      email,
      password,
    });
  },
  contactUs: async (payloads: IContactUs): Promise<ICommonMessageResponse> => {
    return apiClient.post("/contactus", payloads);
  },
  userAuthAdminLogin: async (
    payloads: TCustomerLoginSchema
  ): Promise<IResponse<string>> => {
    return apiClient.post("/userAuth/admin/login", payloads);
  },
};
