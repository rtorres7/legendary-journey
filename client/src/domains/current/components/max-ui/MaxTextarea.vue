<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium"
    >{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template>
  </label>
  <textarea
    v-bind="$attrs"
    :id="uuid"
    :value="modelValue"
    class="min-h-[2rem] w-full rounded-lg cursor-default py-1 px-2 mt-1 text-left bg-transparent disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700 border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 resize-none placeholder:italic"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script>
import uniqueID from "@current/composables/uniqueID";
export default {
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
