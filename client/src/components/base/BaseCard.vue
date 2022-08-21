<template>
  <div
    :class="[
      'shadow-md dark:shadow-none energy:shadow-none bg-white dark:bg-slate-800/50 energy:bg-zinc-800',
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
    rounded: {
      default: true,
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
      if (props.rounded) {
        classes.push("rounded");
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
  @apply hover:underline hover:bg-white/80 dark:hover:bg-slate-800/75 energy:hover:bg-zinc-700/75;
}
.rounded {
  @apply rounded-lg;
}
</style>
