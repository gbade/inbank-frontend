import { createStore } from 'vuex'
import purchaseApprovalModule from './purchaseApproval'

// Define the root state type
export interface RootState {
// Add any root state properties here
}

// Create and configure the store
export default createStore<RootState>({
state: {
    // Root state goes here
},
modules: {
    purchaseApproval: purchaseApprovalModule
}
})

