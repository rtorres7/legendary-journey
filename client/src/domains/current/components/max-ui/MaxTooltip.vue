<template>
  <!-- TODO: classes need to be refactored in the future to minimize repetition -->
  <div class="group relative">
    <slot />
    <span
      class="absolute opacity-0 -translate-x-[10000px] transition-opacity duration-300 group-hover:-translate-x-0 overflow:hidden group-hover:opacity-100 -top-2 w-28 mt-2 px-2 py-2 bg-slate-200 dark:bg-slate-600 energy:bg-zinc-600 rounded-lg font-normal text-center text-sm text-slate-900 dark:text-slate-200 energy:text-zinc-200 z-[15]"
      :class="
        icon && placement === 'bottom'
          ? '-left-11 translate-y-full after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-slate-200 dark:after:border-b-slate-600 energy:after:border-b-zinc-600'
          : placement === 'bottom' && !icon
          ? '-left-2 translate-y-full after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-slate-200 dark:after:border-b-slate-600 energy:after:border-b-zinc-600'
          : placement === 'left'
          ? '-left-32 -translate-x-full before:absolute before:top-1/2  before:left-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-r-transparent before:border-l-slate-200 dark:before:border-l-slate-600 energy:before:border-l-zinc-600'
          : placement === 'right'
          ? '-right-32 translate-x-full before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-200 dark:before:border-r-slate-600 energy:before:border-r-zinc-600'
          : '-left-2 -translate-y-full after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-slate-200 dark:after:border-t-slate-600 energy:after:border-t-zinc-600'
      "
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    placement: {
      type: String,
      default: "top",
    },
    text: {
      type: String,
      default: "Coming Soon",
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
};
</script>
<style scoped lang="scss"></style>
