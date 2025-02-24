import { ApprovalResponse } from './ApprovalResponse';

export interface PurchaseApprovalState {
    approvalResult: ApprovalResponse | null; // Updated to reflect the new ApprovalResponse structure
    loading: boolean;
    error: string | null;
}
