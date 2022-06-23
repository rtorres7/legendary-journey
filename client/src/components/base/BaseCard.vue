<template>
  <div
    class="rounded-lg shadow-md hover:underline"
    :class="[
      locked
        ? 'bg-slate-200 hover:bg-slate-300/80 dark:bg-slate-700 dark:hover:bg-slate-700/80 energy:bg-gray-700 energy:hover:bg-gray-700/80'
        : 'cursor-pointer bg-slate-50 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 energy:bg-gray-800 energy:hover:bg-gray-700/80',
    ]"
  >
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    locked: {
      default: false,
      type: Boolean,
    },
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>