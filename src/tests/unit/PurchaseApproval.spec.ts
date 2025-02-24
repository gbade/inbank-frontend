import { mount } from '@vue/test-utils';
import { createStore, Store } from 'vuex';
import PurchaseApproval from '@/views/PurchaseApproval.vue';
import FormInput from '@/components/FormInput.vue';
import purchaseApproval, { PurchaseApprovalState } from '@/store/purchaseApproval';
import axios from 'axios';

jest.mock('axios');

interface RootState {
  purchaseApproval: PurchaseApprovalState;
}

const createVuexStore = (): Store<RootState> => {
  return createStore<RootState>({
    modules: {
      purchaseApproval: {
        ...purchaseApproval,
        state: {
          approvalResult: null,
          loading: false,
          error: null,
        },
      },
    },
  });
};

describe('PurchaseApproval.vue', () => {
beforeEach(() => {
    jest.clearAllMocks();
});
  it('renders the form correctly', () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
    global: {
        plugins: [store],
        components: {
            FormInput
        }
    },
    });

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findComponent(FormInput).exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('updates amount value on input', async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
      },
    });

    const formInput = wrapper.findComponent(FormInput);
    await formInput.vm.$emit('update:modelValue', '1000');

    expect(formInput.props('modelValue')).toBe('1000');
  });

it('shows loading state during form submission', async () => {
const store = createVuexStore();


(axios.post as jest.Mock).mockImplementation(() => 
    new Promise(resolve => setTimeout(resolve, 1000))
);

const wrapper = mount(PurchaseApproval, {
    global: {
    plugins: [store],
    components: { FormInput }
    },
});


const formInputs = wrapper.findAllComponents(FormInput);
await formInputs[0].vm.$emit('update:modelValue', '12345');
await formInputs[1].vm.$emit('update:modelValue', '1000');
await formInputs[2].vm.$emit('update:modelValue', '12');

await wrapper.vm.$nextTick();

const form = wrapper.find('form');
await form.trigger('submit.prevent');

expect(store.state.purchaseApproval.loading).toBe(true);
});

  it('displays error message when submission fails', async () => {
    const store = createVuexStore();
    store.state.purchaseApproval.error = 'Test error message';

    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.text()).toContain('Test error message');
  });

  it('displays success message when approval is granted', async () => {
    const store = createVuexStore();
    store.state.purchaseApproval.approvalResult = {
      approved: true,
      approvedAmount: 1000,
      message: 'Approved',
    };

    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.text()).toContain('Approved');
    expect(wrapper.text()).toContain('1000');
});

it('makes API call with correct parameters on form submission', async () => {
    const mockApiResponse = {
        data: {
            approved: true,
            approvedAmount: 1500,
            message: 'Purchase approved'
        }
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);
    
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
        global: {
            plugins: [store],
            components: { FormInput }
        }
    });

    const formInputs = wrapper.findAllComponents(FormInput);
    await formInputs[0].vm.$emit('update:modelValue', '98765');
    await formInputs[1].vm.$emit('update:modelValue', '1500');
    await formInputs[2].vm.$emit('update:modelValue', '24');
    
    await wrapper.vm.$nextTick();
    
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/purchase\/approval/),
        expect.objectContaining({
            personalId: '98765',
            requestedAmount: 1500,
            paymentPeriod: 24
        })
    );
});
});

it('handles API error correctly', async () => {
    const errorMessage = 'API Error';
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
        global: {
            plugins: [store],
            components: { FormInput }
        }
    });

    const formInputs = wrapper.findAllComponents(FormInput);
    await formInputs[0].vm.$emit('update:modelValue', '98765');
    await formInputs[1].vm.$emit('update:modelValue', '1500');
    await formInputs[2].vm.$emit('update:modelValue', '24');
    
    await wrapper.vm.$nextTick();
    
    await wrapper.find('form').trigger('submit.prevent');
    
    // Waiting for the promise rejection and state updates
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    
    expect(store.state.purchaseApproval.error).toBe(errorMessage);
});
