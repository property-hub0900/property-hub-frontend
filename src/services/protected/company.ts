import apiClient from "@/lib/api-client";
import { MetricsData } from "@/types/common";

// Define types for the API requests and responses
export type StaffRole = "agent" | "manager";

export interface StaffMember {
  staffId: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: StaffRole;
  languagesSpoken: string;
  joinedDate: string;
  status: "active" | "inactive";
  canAddProperty: boolean;
  canPublishProperty: boolean;
  canFeatureProperty: boolean;
  biography: string;
  profilePhoto?: string;
  user?: Record<string, any>;
  staffPermissions?: Record<string, any>;
  active?: boolean;
  isOwner?: boolean;
  companyId?: number;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InviteStaffRequest {
  status: string;
  languagesSpoken: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: StaffRole;
  canAddProperty: boolean;
  canPublishProperty: boolean;
  canFeatureProperty: boolean;
  biography?: string;
  profilePhoto?: string;
}

export interface UpdateCompanyRequest {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  companySize?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateStaffRequest extends Partial<InviteStaffRequest> {
  id: string;
  status?: "active" | "inactive";
}

// Generic response interface to match the auth service pattern
export interface IResponse<T> {
  data: T | null;
  message: string;
  success: boolean;
}

// Company service with methods for staff management
export const companyService = {
  // Get all staff members
  getAllStaff: async (): Promise<IResponse<StaffMember[]>> => {
    return apiClient.get("companies/staff");
  },

  updateStaffProfile: async (payload: UpdateStaffRequest): Promise<IResponse<StaffMember>> => {
    return apiClient.put(`/staff/update-profile`, payload);
  },

  // Get a specific staff member by ID
  getStaffById: async (id: string): Promise<IResponse<StaffMember>> => {
    return apiClient.get(`/staff/${id}`);
  },

  // Invite a new staff member
  inviteStaff: async (
    payload: InviteStaffRequest
  ): Promise<IResponse<StaffMember>> => {
    try {
      if (payload.status === "active") {
        payload["active"] = true;
      } else {
        payload["active"] = false;
      }

      if (payload.role === "admin" as any) {
        payload["role"] = "manager";
      } else {
        payload["role"] = "agent";
      }

      return apiClient.post("/staff/invite", payload);
    } catch (error: any) {
      console.error("Failed to invite staff:", error);
      throw error;
    }
  },

  // Update an existing staff member
  updateStaff: async (
    payload: UpdateStaffRequest
  ): Promise<IResponse<StaffMember>> => {

    if (payload.status) {
      payload["active"] = payload.status === "active";
    }
    return apiClient.put(`/staff/${payload.id}`, payload);
  },

  // Delete a staff member
  deleteStaff: async (id: string): Promise<IResponse<boolean>> => {
    return apiClient.delete(`/staff/${id}`);
  },

  // Change staff status (activate/deactivate)
  changeStaffStatus: async (
    id: string,
    status: "active" | "inactive"
  ): Promise<IResponse<StaffMember>> => {
    return apiClient.patch(`/staff/${id}/status`, { status });
  },

  // Get staff statistics
  getStaffStats: async (): Promise<
    IResponse<{
      totalStaff: number;
      activeStaff: number;
      inactiveStaff: number;
      adminCount: number;
      agentCount: number;
    }>
  > => {
    return apiClient.get("/staff/stats");
  },

  // Update staff permissions
  updateStaffPermissions: async (
    id: string,
    permissions: {
      canAddProperty?: boolean;
      canPublishProperty?: boolean;
      canFeatureProperty?: boolean;
    }
  ): Promise<IResponse<StaffMember>> => {
    return apiClient.patch(`/staff/${id}/permissions`, permissions);
  },

  // Resend invitation email to staff
  resendInvitation: async (email: string): Promise<IResponse<string>> => {
    return apiClient.post("/staff/resend-invitation", { email });
  },
  getMe: async () => {
    return apiClient.get("/staff/me");
  },
  getTopUpPlans: async (): Promise<IResponse<any>> => {
    return apiClient.get("companies/topup-plans");
  },
  updateCompany: async (
    payload: UpdateCompanyRequest
  ): Promise<IResponse<any>> => {
    return apiClient.put(`/companies`, payload);
  },
  getCompanySubscription: async (): Promise<IResponse<any>> => {
    return apiClient.get("companies/subscriptions");
  },
  renewSubscription: async (payload: any): Promise<IResponse<any>> => {
    return apiClient.post("companies/renew-subscription", payload);
  },

  purchaseTopUp: async (payload: any): Promise<IResponse<any>> => {
    return apiClient.post(`companies/purchase-points/${payload.topupId}`, payload);
  },

  getTopUpHistoryAndPointsTransactions: async (type: string = "topup", page: number = 0, pageSize: number = 999): Promise<IResponse<any>> => {
    return apiClient.get(`companies/points-transaction?type=${type}&page=${page}&pageSize=${pageSize}`);
  },

  refundPoints: async (transactionId: string): Promise<IResponse<any>> => {
    return apiClient.put(`companies/refund-points/${transactionId}`);
  },

  getMetrics: async (period: string): Promise<IResponse<MetricsData | any>> => {
    return apiClient.get(`companies/metrics?period=${period}`);
  },

  getPropertyInsights: async (page = 0, pageSize = 9999): Promise<IResponse<any>> => {
    return apiClient.get(`companies/properties-insights?page=${page}&pageSize=${pageSize}`);
  },

  getAgentInsights: async (page = 0, pageSize = 9999): Promise<IResponse<any>> => {
    return apiClient.get(`companies/agents-insights?page=${page}&pageSize=${pageSize}`);
  },
};
