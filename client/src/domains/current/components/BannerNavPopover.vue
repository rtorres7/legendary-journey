<template>
  <Popover class="static">
    <PopoverButton
      class="flex items-center font-semibold hover:text-slate-100 dark:hover:text-slate-100 energy:hover:text-energy-yellow h-[2.5rem]"
      tabindex="0"
    >
      <slot name="heading"></slot>
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
        class="origin-top-right absolute min-w-[26rem] transform z-10"
        :class="wideShrunk ? 'w-full right-0' : ''"
      >
        <div
          class="shadow-2xl py-4 px-6 w-full ring-1 ring-black ring-opacity-5 focus:outline-none bg-mission-blue/95 dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300"
        >
          <slot name="content" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
  },
  props: {
    //Popover width expands when screen size is shrunk to cover the horizontal width of the screen
    wideShrunk: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>
