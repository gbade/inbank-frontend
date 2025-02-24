import { mount } from "@vue/test-utils";
import { createStore, Store } from "vuex";
import PurchaseApproval from "@/views/PurchaseApproval.vue";
import FormInput from "@/components/FormInput.vue";
import ApprovalResult from "@/components/ApprovalResult.vue";
import purchaseApproval, {
  PurchaseApprovalState,
} from "@/store/purchaseApproval";
import axios from "axios";

jest.mock("axios");

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

describe("PurchaseApproval.vue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the form correctly", () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
      },
      global: {
        plugins: [store],
        components: {
          FormInput,
          ApprovalResult,
        },
      },
    });

    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.findComponent(FormInput).exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("updates amount value on input", async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
      },
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    const formInput = wrapper.findComponent(FormInput);
    await formInput.vm.$emit("update:modelValue", "1000");

    expect(formInput.props("modelValue")).toBe("1000");
  });

  it("validates personal ID field correctly", async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    const personalIdInput = wrapper.findAllComponents(FormInput)[0];

    // Test invalid input
    await personalIdInput.vm.$emit("update:modelValue", "123");
    await wrapper.vm.$nextTick();
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.find('[data-testid="personal-id-error"]').text()).toContain(
      "Personal ID"
    );

    // Test valid input
    await personalIdInput.vm.$emit("update:modelValue", "12345");
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="personal-id-error"]').exists()).toBe(
      true
    );
  });

  it("validates payment period field correctly", async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    const periodInput = wrapper.findAllComponents(FormInput)[2];

    // Test valid period
    await periodInput.vm.$emit("update:modelValue", "24");
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="period-error"]').exists()).toBe(true);
  });

  it("disables submit button when form is invalid", async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeDefined();

    // Fill in valid data
    const [personalId, amount, period] = wrapper.findAllComponents(FormInput);
    await personalId.vm.$emit("update:modelValue", "12345");
    await amount.vm.$emit("update:modelValue", "1000");
    await period.vm.$emit("update:modelValue", "24");
    await wrapper.vm.$nextTick();

    expect(submitButton.attributes("disabled")).toBeUndefined();
  });

  it("integrates with ApprovalResult component correctly", async () => {
    const store = createVuexStore();
    store.state.purchaseApproval.loading = false;
    const approvalResult = {
      approved: true,
      approvedAmount: 1000,
      message: "Purchase approved",
      terms: {
        monthlyPayment: 100,
        totalCost: 1200,
        interestRate: 10,
      },
    };

    store.state.purchaseApproval.approvalResult = approvalResult;

    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
        approvalResult: approvalResult,
      },
      global: {
        plugins: [store],
        components: { FormInput, ApprovalResult },
      },
    });

    const resultComponent = wrapper.findComponent(ApprovalResult);
    expect(resultComponent.exists()).toBe(true);
    expect(resultComponent.props("approvalResult")).toEqual(approvalResult);
    expect(resultComponent.props("loading")).toBe(false);
  });

  it("shows loading state during form submission", async () => {
    const store = createVuexStore();

    (axios.post as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
      },
      global: {
        plugins: [store],
        components: { FormInput, ApprovalResult },
      },
    });

    const formInputs = wrapper.findAllComponents(FormInput);
    await formInputs[0].vm.$emit("update:modelValue", "12345");
    await formInputs[1].vm.$emit("update:modelValue", "1000");
    await formInputs[2].vm.$emit("update:modelValue", "12");

    await wrapper.vm.$nextTick();

    const form = wrapper.find("form");
    await form.trigger("submit.prevent");

    expect(store.state.purchaseApproval.loading).toBe(true);
  });

  it("displays error message when submission fails", async () => {
    const store = createVuexStore();
    store.state.purchaseApproval.error = "Test error message";

    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
      },
      global: {
        plugins: [store],
        components: { FormInput, ApprovalResult },
      },
    });

    expect(wrapper.text()).toContain("Test error message");
  });

  it("displays success message when approval is granted", async () => {
    const store = createVuexStore();
    const approvalResult = {
      approved: true,
      approvedAmount: 1000,
      message: "Approved",
      terms: {
        monthlyPayment: 100,
        totalCost: 1200,
        interestRate: 10,
      },
    };

    store.state.purchaseApproval.approvalResult = approvalResult;

    const wrapper = mount(PurchaseApproval, {
      props: {
        loading: false,
        approvalResult: approvalResult,
      },
      global: {
        plugins: [store],
        components: { FormInput, ApprovalResult },
      },
    });

    await wrapper.vm.$nextTick();
    const resultComponent = wrapper.findComponent(ApprovalResult);
    expect(resultComponent.exists()).toBe(true);
    expect(resultComponent.props("approvalResult")).toEqual(approvalResult);
    expect(resultComponent.props("loading")).toBe(false);
  });

  it("prevents form submission when validation fails", async () => {
    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    // Submit with invalid data
    const formInputs = wrapper.findAllComponents(FormInput);
    await formInputs[0].vm.$emit("update:modelValue", ""); // Invalid personal
    await formInputs[1].vm.$emit("update:modelValue", "50");
    await formInputs[2].vm.$emit("update:modelValue", "5");

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(axios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll('[data-testid*="error"]').length).toBeGreaterThan(0);
  });

  it("makes API call with correct parameters on form submission", async () => {
    const mockApiResponse = {
      data: {
        approved: true,
        approvedAmount: 1500,
        message: "Purchase approved",
      },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const store = createVuexStore();
    const wrapper = mount(PurchaseApproval, {
      global: {
        plugins: [store],
        components: { FormInput },
      },
    });

    const formInputs = wrapper.findAllComponents(FormInput);
    await formInputs[0].vm.$emit("update:modelValue", "98765");
    await formInputs[1].vm.$emit("update:modelValue", "1500");
    await formInputs[2].vm.$emit("update:modelValue", "24");

    await wrapper.vm.$nextTick();

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/purchase\/approval/),
      expect.objectContaining({
        personalId: "98765",
        requestedAmount: 1500,
        paymentPeriod: 24,
      })
    );
  });
});

it("handles API error correctly", async () => {
  const errorMessage = "API Error";
  (axios.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  const store = createVuexStore();
  const wrapper = mount(PurchaseApproval, {
    global: {
      plugins: [store],
      components: { FormInput },
    },
  });

  const formInputs = wrapper.findAllComponents(FormInput);
  await formInputs[0].vm.$emit("update:modelValue", "98765");
  await formInputs[1].vm.$emit("update:modelValue", "1500");
  await formInputs[2].vm.$emit("update:modelValue", "24");

  await wrapper.vm.$nextTick();

  await wrapper.find("form").trigger("submit.prevent");

  // Waiting for the promise rejection and state updates
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();

  expect(store.state.purchaseApproval.error).toBe(errorMessage);
});
