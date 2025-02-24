<template>
<div class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Purchase Approval</h1>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
    {{ error }}
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow-md">
    <FormInput
        v-model="form.personalId"
        label="Personal ID"
        name="personalId"
        :error="errors.personalId"
        :inputProps="{ 
        type: 'text',
        required: true,
        placeholder: 'Enter your personal ID'
        }"
    />
    <FormInput
        v-model="form.requestedAmount"
        label="Requested Amount"
        name="requestedAmount"
        :error="errors.requestedAmount"
        :inputProps="{ 
        type: 'number',
        required: true,
        min: 0,
        step: '0.01',
        placeholder: 'Enter amount'
        }"
    />
    <FormInput
        v-model="form.paymentPeriod"
        label="Payment Period (months)"
        name="paymentPeriod"
        :error="errors.paymentPeriod"
        :inputProps="{ 
        type: 'number',
        required: true,
        min: 1,
        max: 360,
        placeholder: 'Enter payment period in months'
        }"
    />
    <button
        type="submit"
        class="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        :disabled="isLoading || !isFormValid"
    >
        <span v-if="isLoading" class="mr-2">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        </span>
        {{ isLoading ? 'Processing...' : 'Submit Application' }}
    </button>
    </form>

    <ApprovalResult v-if="approvalResult || error" class="mt-8" />
</div>
</template>

<script setup lang="ts">
  import { reactive, computed } from 'vue'
  import { useStore } from 'vuex'
  import FormInput from '@/components/FormInput.vue'
  import ApprovalResult from '@/components/ApprovalResult.vue'

  interface FormData {
    personalId: string
    requestedAmount: number | ''
    paymentPeriod: number | ''
  }

  interface FormErrors {
    personalId?: string
    requestedAmount?: string
    paymentPeriod?: string
  }

const store = useStore()

const form = reactive<FormData>({
personalId: '',
requestedAmount: '',
paymentPeriod: ''
})

const error = computed(() => store.state.purchaseApproval.error)
const approvalResult = computed(() => store.state.purchaseApproval.approvalResult)

  const errors = reactive<FormErrors>({})

  const isLoading = computed(() => store.state.purchaseApproval.loading)
  const isFormValid = computed(() => {
  return form.personalId.length > 0 &&
      Number(form.requestedAmount) > 0 &&
      Number(form.paymentPeriod) > 0 &&
      Object.keys(errors).length === 0
  })

  const validateForm = (): boolean => {
    errors.personalId = !form.personalId ? 'Personal ID is required' : ''
    errors.requestedAmount = !form.requestedAmount || Number(form.requestedAmount) <= 0 
        ? 'Amount must be greater than 0' : ''
    errors.paymentPeriod = !form.paymentPeriod || Number(form.paymentPeriod) <= 0 
        ? 'Payment period must be greater than 0' : ''

    return Object.values(errors).every(error => !error)
  }

const handleSubmit = async () => {
    if (!validateForm()) return

    const submissionData = {
        personalId: form.personalId,
        requestedAmount: Number(form.requestedAmount),
        paymentPeriod: Number(form.paymentPeriod)
    }

    try {
        store.commit('purchaseApproval/setError', null);
        await store.dispatch('purchaseApproval/approvePurchase', submissionData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'API Error';
        store.commit('purchaseApproval/setError', errorMessage);
    }
}
</script>
