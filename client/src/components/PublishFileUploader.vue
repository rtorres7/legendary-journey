<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="
      active
        ? 'bg-white text-black dark:bg-teal-300 energy:bg-energy-yellow'
        : ''
    "
    class="
      w-full
      mt-2
      p-2
      flex
      justify-center
      items-center
      gap-4
      bg-slate-100
      hover:bg-slate-200/80
      dark:bg-slate-700 dark:hover:bg-slate-700/80
      energy:bg-gray-700 energy:hover:bg-gray-700/80
      border border-dashed border-slate-400
      dark:border-teal-300
      energy:border-energy-yellow
    "
  >
    <span class="text-sm xl:text-base line-clamp-1">Drag and Drop or</span>
    <slot />
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return {
      active,
      toggleActive,
    };
  },
};
</script>

<style lang="scss">
</style>
