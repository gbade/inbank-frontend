import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PurchaseApproval from '@/views/PurchaseApproval.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'PurchaseApproval',
        component: PurchaseApproval,
    },
    {
        path: '/result',
        name: 'ApprovalResult',
        component: () => import('@/views/ApprovalResult.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
