<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <input
      :id="name"
      v-bind="inputProps"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
      :class="[
        'mt-1 block w-full shadow-sm sm:text-sm rounded-md p-2',
        error ? 'border-red-300' : 'border-gray-300',
      ]"
    />
    <p
      v-if="error"
      :data-testid="name + '-error'"
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormInput",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: "",
    },
    inputProps: {
      type: Object,
      required: false,
    },
  },
  emits: ["update:modelValue"],
});
</script>
