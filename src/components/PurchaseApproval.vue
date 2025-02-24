<template>
  <div class="purchase-approval space-y-6">
    <h2>Purchase Approval Request</h2>
    <form @submit.prevent="submitForm" class="space-y-6">
      <FormInput
        name="personalId"
        label="Personal ID"
        v-model="personalId"
        :error="error"
      />
      <FormInput
        name="requestedAmount"
        label="Requested Amount"
        type="number"
        v-model="requestedAmount"
        :error="error"
      />
      <FormInput
        name="paymentPeriod"
        label="Payment Period (months)"
        type="number"
        v-model="paymentPeriod"
        :error="error"
      />
      <button
        type="submit"
        :disabled="loading"
        :class="{
          'bg-blue-500 text-white': !loading,
          'bg-gray-400 text-gray-700 cursor-not-allowed flex gap-2 justify-center': loading,
        }"
        class="py-2 px-4 rounded-md transition-colors duration-200 w-full"
      >
        <span v-if="loading">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
        {{ loading ? "Processing..." : "Submit Request" }}
      </button>
    <div v-if="errors.personalId" class="error" data-testid="personal-id-error">{{ errors.personalId }}</div>
    <div v-if="errors.requestedAmount" class="error" data-testid="amount-error">{{ errors.requestedAmount }}</div>
    <div v-if="errors.paymentPeriod" class="error" data-testid="period-error">{{ errors.paymentPeriod }}</div>
    <div v-if="error" class="error" data-testid="form-error">{{ error }}</div>
    <div v-if="success" class="success" data-testid="form-success">{{ success }}</div>
</form>
<ApprovalResult v-if="loading || approvalResult" :loading="loading" :approval-result="approvalResult" />
</div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
import ApprovalResult from "./ApprovalResult.vue";
import FormInput from "./FormInput.vue";
import { ApprovalRequest } from "@/models/ApprovalRequest";

defineProps({
    loading: {
        type: Boolean,
        required: true
    },
    approvalResult: {
        type: Object as () => { approved: boolean; approvedAmount: number } | null,
        default: null
    }
})

const emit = defineEmits(["submit"]);

const personalId = ref("");
const requestedAmount = ref("");
const paymentPeriod = ref("");
const error = ref("");
const errors = ref({
personalId: "",
requestedAmount: "",
paymentPeriod: ""
});
const success = ref(false);

const validateForm = () => {
errors.value = {
    personalId: "",
    requestedAmount: "",
    paymentPeriod: ""
};
error.value = "";

if (!personalId.value || personalId.value.trim() === '') {
    errors.value.personalId = "Personal ID is required";
    return false;
}

const amount = Number(requestedAmount.value);
if (isNaN(amount) || amount < 100 || amount > 10000) {
    errors.value.requestedAmount = "Amount must be between 100 and 10000";
    return false;
}

const period = Number(paymentPeriod.value);
if (isNaN(period) || period < 12 || period > 60) {
    errors.value.paymentPeriod = "Payment period must be between 12 and 60 months";
    return false;
}

return true;
};

const submitForm = () => {
// Reset state
error.value = "";
success.value = false;

// Validate form
if (!validateForm()) {
    return;
}

  const request: ApprovalRequest = {
    personalId: personalId.value,
    requestedAmount: Number(requestedAmount.value),
    paymentPeriod: Number(paymentPeriod.value),
  };

  emit("submit", request);
};
</script>

<style scoped>
.purchase-approval {
  padding: 20px;
}
</style>
