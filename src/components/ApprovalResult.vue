<template>
  <div
    class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 mt-4"
  >
    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded p-4">
      <div class="flex items-center">
        <svg
          class="h-5 w-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="ml-3 text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="approvalResult" class="space-y-4">
      <div
        class="flex items-center"
        :class="approvalResult.approved ? 'text-green-600' : 'text-red-600'"
      >
        <svg
          v-if="approvalResult.approved"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <h2 class="ml-2 text-xl font-semibold">
          {{
            approvalResult.approved
              ? "Purchase Approved!"
              : "Purchase Not Approved"
          }}
        </h2>
      </div>

      <div
        v-if="approvalResult.approved"
        class="bg-green-50 border border-green-200 rounded p-4"
      >
        <p class="text-green-700">
          Your purchase has been approved for the amount of
          <span class="font-semibold"
            >€{{ formatAmount(approvalResult.approvedAmount) }}</span
          >
          <span data-testid="raw-amount" class="hidden">{{
            approvalResult.approvedAmount
          }}</span>
        </p>
      </div>

      <div v-else class="bg-red-50 border border-red-200 rounded p-4">
        <p class="text-red-700">
          Unfortunately, your purchase request could not be approved at this
          time.
        </p>
      </div>
    </div>

    <!-- No Result State -->
    <div v-else class="text-gray-500 text-center">
      No approval result available
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
  approvalResult: {
    type: Object as () => { approved: boolean; approvedAmount: number } | null,
    required: true,
  },
});

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
</script>
