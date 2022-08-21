<template>
  <div
    :class="[
      'rounded-lg shadow-md bg-white dark:bg-slate-800 energy:bg-gray-800',
      computedClass,
    ]"
  >
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
        classes.push("hoverable");
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
.hoverable {
  @apply hover:underline hover:bg-white/80 dark:hover:bg-slate-800/80 energy:hover:bg-gray-800/80;
}
</style>
