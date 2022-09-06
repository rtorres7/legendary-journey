<template>
  <template v-if="disabled">
    <span
      :class="[
        current
          ? 'z-10 border-mission-blue dark:border-slate-300 energy:border-zinc-300 bg-slate-50 dark:bg-slate-900 energy:bg-zinc-900 text-mission-blue dark:text-slate-300 energy:text-zinc-300'
          : 'border-gray-300 dark:border-slate-300/50 energy:border-zinc-300/50 bg-white dark:bg-slate-800 energy:bg-zinc-800 text-gray-300 dark:text-slate-500 energy:text-zinc-500',
        'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
      ]"
    >
      <slot />
    </span>
  </template>
  <template v-else>
    <a
      class="
        cursor-pointer
        relative
        inline-flex
        items-center
        px-4
        py-2
        text-sm
        font-medium
        border border-gray-300
        dark:border-slate-300/50
        energy:border-zinc-300/50
        bg-white
        dark:bg-slate-800
        energy:bg-zinc-800
        hover:bg-gray-50
        dark:hover:bg-slate-900/70
        energy:hover:bg-zinc-900/70
        text-gray-500
        dark:text-slate-300
        energy:text-zinc-300
      "
    >
      <slot />
    </a>
  </template>
</template>

<script>
export default {
  components: {},
  props: {
    current: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>
<style scoped lang="scss">
</style>
