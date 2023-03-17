<template>
  <button
    :class="[
      'select-none text-sm shadow-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25',
      'disabled:text-slate-600 disabled:dark:text-slate-400 disabled:energy:text-zinc-400 disabled:border-transparent disabled:dark:border-transparent disabled:energy:border-transparent disabled:shadow-none disabled:cursor-not-allowed',
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
  @apply bg-transparent dark:bg-slate-800 energy:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-slate-700/75 energy:hover:bg-zinc-700/75 dark:border-transparent energy:border-transparent disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700;
}
.secondary-btn {
  @apply bg-transparent  hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900 disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700;
}
.danger-btn {
  @apply text-white border-transparent bg-red-600 hover:bg-red-700 disabled:bg-red-400/70;
}
</style>
