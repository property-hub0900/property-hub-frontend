import apiClient from "@/lib/api-client";
import { IResponse } from "./company";

// Customer service with methods for customer operations
export const customerService = {
    // Get current customer data
    getMe: async () => {
        return apiClient.get("/customer/me");
    },
}; 