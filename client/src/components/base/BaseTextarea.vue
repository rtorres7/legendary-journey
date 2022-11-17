<template>
  <label :for="uuid" v-if="label" class="text-sm font-medium">{{
      label
  }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="text-red-500">*</span>
    </template>
  </label>
  <textarea v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="
      min-h-[2rem]
      w-full
      py-1
      px-2
      mt-1
      text-left
      bg-white
      dark:bg-slate-700
      energy:bg-zinc-700
      border border-gray-200
      dark:border-slate-800
      energy:border-zinc-800
      rounded-lg
      shadow-md
      cursor-default
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-opacity-75
      focus-visible:ring-offset-2
      resize-none
      placeholder:italic
    " :id="uuid"></textarea>
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
      default: false
    }
  },
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
