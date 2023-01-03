<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium"
    >{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template>
  </label>
  <input
    v-bind="$attrs"
    :id="uuid"
    autocomplete="off"
    :value="modelValue"
    class="min-h-[2rem] flex w-full py-1 px-2 mt-1 bg-white dark:bg-slate-700 energy:bg-zinc-600 border border-gray-200 dark:border-slate-800 energy:border-zinc-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 placeholder:italic"
    :class="
      disabledColor
        ? 'disabled:bg-slate-100/80 disabled:dark:bg-slate-800 disabled:energy:bg-zinc-700'
        : ''
    "
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script>
import uniqueID from "@/composables/uniqueID";
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabledColor: {
      type: Boolean,
      default: true,
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
<style lang="scss">
/* Empty on Purpose */
</style>
