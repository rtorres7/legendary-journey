<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium">
    {{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500"> * </span>
    </template>
  </label>
  <input
    v-bind="$attrs"
    :id="uuid"
    autocomplete="off"
    :value="modelValue"
    class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-1 bg-transparent disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700 border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 placeholder:italic"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script>
/* eslint-disable no-undef */
import uniqueID from "@/composables/uniqueID";
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup() {
    const uuid = uniqueID().getID();

    return {
      uuid,
    };
  },
};
</script>
