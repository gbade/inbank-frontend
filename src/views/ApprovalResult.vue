<template>
    <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold mb-4">Approval Result</h1>
        <p v-if="result" class="text-green-500">Approved Amount: {{ result.approvedAmount }}</p>
        <p v-else class="text-red-500">Approval not found</p>
        <p>{{ result.message }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'ApprovalResult',
    setup() {
        const store = useStore();
        const result = computed(() => store.getters['purchaseApproval/approvalResult']);
        return { result };
    },
});
</script>
