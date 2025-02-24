import axios from 'axios';

const API_URL = 'http://localhost:8080/api/purchase/approval';

export interface ApprovalRequest {
    personalId: string;
    requestedAmount: number;
    paymentPeriod: number;
}

export interface ApprovalResponse {
    approved: boolean;
    approvedAmount: number;
    message: string;
}

export const submitPurchaseApproval = async (payload: ApprovalRequest): Promise<ApprovalResponse> => {
    const response = await axios.post<ApprovalResponse>(API_URL, payload);
    return response.data;
};
