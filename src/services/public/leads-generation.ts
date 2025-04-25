
import apiClient from "@/lib/api-client";
import type { ICommonMessageResponse, IResponse } from "@/types/common";


export interface IGenerateLeadsSchema {
    propertyId: number;
    type: "call" | "email" | "whatsapp" | "visit";
}
export const leadsGenerationService = {
    generateLeads: async (payloads: IGenerateLeadsSchema): Promise<IResponse<ICommonMessageResponse>> => {
        return apiClient.post("/properties/leads", payloads);

    },
};

