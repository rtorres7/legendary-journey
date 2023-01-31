<template>
  <button
    :class="[
      'select-none text-sm shadow-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25',
      'disabled:text-slate-400 disabled:dark:text-slate-500 disabled:energy:text-zinc-500 disabled:cursor-not-allowed',
      `${color}-btn`,
    ]"
  >
    <slot />
  </button>
</template>
<script>
export default {
  components: {},
  props: {
    color: {
      type: String,
      default: "default",
    },
  },
};
</script>
<style lang="scss" scoped>
.default-btn {
  @apply bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/75 energy:hover:bg-zinc-700/75 disabled:bg-inherit disabled:dark:bg-inherit disabled:energy:bg-inherit;
}
.secondary-btn {
  @apply bg-white dark:bg-slate-800/50 energy:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-slate-700/75 energy:hover:bg-zinc-700/75 disabled:bg-inherit disabled:dark:bg-inherit disabled:energy:bg-inherit;
}
.danger-btn {
  @apply text-white border-transparent bg-red-600 hover:bg-red-700 disabled:bg-red-400/70;
}
</style>
