<template>
  <div
    :class="[
      'shadow-sm dark:shadow-none energy:shadow-none border border-slate-300 dark:border-none energy:border-none',
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
    alternate: {
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
      if (props.alternate) {
        classes.push("alternate");
      } else {
        classes.push("default");
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
  @apply hover:underline;
}
.rounded {
  @apply rounded-lg;
}
.default {
  @apply bg-white dark:bg-slate-800 energy:bg-zinc-800;
}
.alternate {
  @apply bg-slate-50 dark:bg-slate-700 energy:bg-zinc-700;
}
</style>
