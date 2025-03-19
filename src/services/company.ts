import apiClient from "@/lib/api-client";

// Define types for the API requests and responses
export type StaffRole = "agent" | "admin";

export interface StaffMember {
  staffId: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: StaffRole;
  languages?: string;
  joinedDate: string;
  status: "active" | "inactive";
  canAddProperty: boolean;
  canPublishProperty: boolean;
  canFeatureProperty: boolean;
}

export interface InviteStaffRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: StaffRole;
  canAddProperty: boolean;
  canPublishProperty: boolean;
  canFeatureProperty: boolean;
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
    return apiClient.get("/staff");
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
};
