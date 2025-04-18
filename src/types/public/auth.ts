import { z } from "zod";
import {
  useAuthCustomerRegisterSchema,
  userAuthCustomerLoginSchema,
  userAuthStaffLoginSchema,
  userAuthStaffRegisterSchema,
  verificationSchema,
} from "@/schema/public/auth";

export type TUserAuthStaffRegisterSchema = z.infer<
  ReturnType<typeof userAuthStaffRegisterSchema>
>;

export type TUseAuthCustomerRegisterSchema = z.infer<
  ReturnType<typeof useAuthCustomerRegisterSchema>
>;

export type TCustomerLoginSchema = z.infer<
  ReturnType<typeof userAuthCustomerLoginSchema>
>;
export type TUserAuthCustomerLoginSchema = z.infer<
  ReturnType<typeof userAuthCustomerLoginSchema>
>;

export type TVerificationSchema = z.infer<
  ReturnType<typeof verificationSchema>
>;

export type TUserAuthStaffLoginSchema = z.infer<
  ReturnType<typeof userAuthStaffLoginSchema>
>;

export interface userAuthCustomerLoginResponse {
  loginMethod: string;
  userId: number;
  username: string;
  email: string;
  role: string;
  facebookId: string | null;
  googleId: string | null;
  languagePref: string;
  emailVerified: boolean;
  loginWith: string;
  companyId: string | null;
  lastLogin: string;
  status: boolean;
  isExpireToken: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  scope: string[];
  token: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  isError?: boolean;
  error?: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface SocialLoginPayload {
  googleId?: string;
  facebookId?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IContactUs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  locationPreference: string;
  budget: string;
  purpose: string;
  message: string;
}
