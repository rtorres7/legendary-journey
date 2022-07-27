<template>
  <div :class="['rounded-lg shadow-md', computedClass]">
    <slot />
  </div>
</template>
<script>
import { computed } from "vue";

export default {
  props: {
    locked: {
      default: false,
      type: Boolean,
    },
    hoverable: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const computedClass = computed(() => {
      const classes = [];
      if (props.hoverable) {
        classes.push("hover:underline");
      }
      if (props.locked) {
        classes.push("bg-slate-200 dark:bg-slate-700 energy:bg-gray-700");
        if (props.hoverable) {
          classes.push(
            "hover:bg-slate-200/80 dark:hover:bg-slate-700/80 energy:hover:bg-gray-700/80"
          );
        }
      } else {
        classes.push("bg-white dark:bg-slate-800 energy:bg-gray-800");
        if (props.hoverable) {
          classes.push(
            "hover:bg-white/80 dark:hover:bg-slate-700/80 energy:hover:bg-gray-700/80"
          );
        }
      }
      return classes;
    });
    return {
      computedClass,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
