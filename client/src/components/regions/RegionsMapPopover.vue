<template>
  <Popover class="relative">
    <PopoverButton
      class="
        flex
        items-center
        font-semibold
        hover:text-amber-300
        dark:hover:text-teal-400
        energy:hover:text-energy-yellow
      "
      tabindex="0"
    >
      <GlobeIcon class="h-6 w-6" aria-label="View world map" />
    </PopoverButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <PopoverPanel
        class="
          origin-top-right
          absolute
          min-w-[675px]
          xl:w-[915px]
          2xl:w-[1175px]
          right-0
          mt-3
          transform
          z-10
        "
      >
        <div
          class="
            rounded-md
            shadow-2xl
            p-4
            w-full
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            text-sm text-slate-700
            bg-mission-gray
            dark:bg-slate-700
            energy:bg-gray-700
            dark:ring-0 dark:highlight-white/5 dark:text-slate-300
            energy:text-gray-300
          "
        >
          <RegionsListBox class="mb-4" />
          <RegionsMap aria-hidden="true" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import RegionsMap from "./RegionsMap.vue";
import RegionsListBox from "./RegionsListBox.vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { GlobeIcon } from "@heroicons/vue/outline";

export default {
  components: {
    RegionsMap,
    RegionsListBox,
    Popover,
    PopoverButton,
    PopoverPanel,
    GlobeIcon,
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>