<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium">{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template>
  </label>
  <input
    v-bind="$attrs" :id="uuid" :name="name" :type="type"
    class="
      min-h-[2rem]
      flex
      w-full
      py-1
      px-2
      mt-1
      dark:bg-slate-700
      energy:bg-zinc-600
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
      placeholder:italic
    " @change="handleChange" @blur="handleChange"
  >
  <template v-if="errorMessage">
    <p class="pt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </template>
</template>

<script>
import uniqueID from "@/composables/uniqueID";
import { useField } from 'vee-validate';
export default {
  components: {},
  props: {
    name: {
      type: String
    },
    type: {
      type: String
    },
    label: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    const uuid = uniqueID().getID();
    const { value, errorMessage, handleChange } = useField(props.name)
    return {
      uuid,
      value,
      errorMessage,
      handleChange
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
