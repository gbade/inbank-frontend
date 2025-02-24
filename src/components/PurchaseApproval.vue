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
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
import FormInput from "./FormInput.vue";
import { ApprovalRequest } from "@/models/ApprovalRequest";

defineProps({
    loading: {
        type: Boolean,
        required: true
    }
})

// console.log(loading)

const emit = defineEmits(["submit"]);

const personalId = ref("");
const requestedAmount = ref("");
const paymentPeriod = ref("");
const error = ref("");
const success = ref(false);

const submitForm = () => {
  // Reset state
  error.value = "";

  // Validate form
  if (!personalId.value || !requestedAmount.value || !paymentPeriod.value) {
    error.value = "All fields are required";
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
