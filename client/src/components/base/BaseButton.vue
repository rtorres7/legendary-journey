<template>
  <button
    :class="[
      'bg-white dark:bg-slate-800 energy:bg-gray-800 hover:bg-slate-50/80 dark:hover:bg-slate-700/80 energy:hover:bg-gray-700/80',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 px-4 py-2 rounded-md shadow-lg text-sm border border-transparent',
      computedClass,
    ]"
  >
    <slot />
  </button>
</template>
<script>
import { computed } from "vue";

export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const computedClass = computed(() => {
      const classes = [];
      if (props.type === "danger") {
        classes.push(
          "text-white dark:text-slate-300 energy:text-gray-300 bg-red-600 hover:bg-red-600/80 dark:bg-red-800 dark:hover:bg-red-700/70 energy:bg-red-800 energy:hover:bg-red-700/70"
        );
      }
      return classes;
    });
    return {
      computedClass,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
