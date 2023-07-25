<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      class="cursor-pointer hover:text-black dark:hover:text-white energy:text-white flex space-x-2 items-center"
    >
      <span class="font-medium">{{ title }}</span>
      <ChevronDownIcon
        class="h-4 w-4"
        :class="open ? 'transform rotate-180' : ''"
      />
    </DisclosureButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <DisclosurePanel>
        <slot />
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>
<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronDownIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
