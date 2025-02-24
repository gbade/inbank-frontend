<template>
  <div class="container mx-auto p-4 max-w-[560px]">
    <h1 class="text-3xl font-bold text-center mb-8">
      Purchase Approval System
    </h1>
    <PurchaseApproval :loading="loading" @submit="handleSubmit" />
    <ApprovalResult
      :loading="loading"
      :approval-result="approvalResult"
      :error="error"
      class="mt-8"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PurchaseApproval from "./components/PurchaseApproval.vue";
import ApprovalResult from "./components/ApprovalResult.vue";
import { submitPurchaseApproval } from "./api/purchaseApproval";
import { AxiosError } from "axios";

interface ApprovalRequest {
  personalId: string;
  requestedAmount: number;
  paymentPeriod: number;
}

interface ApprovalResponse {
  approved: boolean;
  approvedAmount: number;
  message: string;
}

const loading = ref(false);
const error = ref<string | undefined>(undefined);
const approvalResult = ref<ApprovalResponse | null>(null);

const handleSubmit = async (formData: ApprovalRequest) => {
  // Reset state before making the request
  loading.value = true;
  error.value = undefined;
  approvalResult.value = null;

  try {
    console.log(formData);
    const response = await submitPurchaseApproval(formData);
    approvalResult.value = response;
  } catch (err) {
    loading.value = false;
    error.value =
      (err as AxiosError<{ message: string }>)?.response?.data?.message ||
      "An unexpected error occurred";
    console.error("Error submitting purchase approval:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
body {
  background-color: #f3f4f6;
}

.container {
  max-width: 800px;
}
</style>
