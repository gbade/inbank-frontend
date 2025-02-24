import { Module } from 'vuex';
import { ApprovalRequest, ApprovalResponse, submitPurchaseApproval } from '@/api/purchaseApproval';

export interface PurchaseApprovalState {
    approvalResult: ApprovalResponse | null;
    loading: boolean;
    error: string | null;
}

const purchaseApproval: Module<PurchaseApprovalState, {}> = {
    namespaced: true,
    state: {
        approvalResult: null,
        loading: false,
        error: null,
    },
    mutations: {
        setApprovalResult(state, result: ApprovalResponse) {
            state.approvalResult = result;
        },
        setLoading(state, loading: boolean) {
            state.loading = loading;
        },
        setError(state, error: string | null) {
            state.error = error;
        },
    },
    actions: {
        async approvePurchase({ commit }, payload: ApprovalRequest) {
            commit('setLoading', true);
            commit('setError', null);
            try {
                const result = await submitPurchaseApproval(payload);
                commit('setApprovalResult', result);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setError', error.message);
                } else {
                    commit('setError', String(error));
                }
            } finally {
                commit('setLoading', false);
            }
        },
    },
    getters: {
        approvalResult: (state) => state.approvalResult,
        isLoading: (state) => state.loading,
        errorMessage: (state) => state.error,
    },
};

export default purchaseApproval;
