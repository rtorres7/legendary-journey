<template>
  <Popover class="hidden lg:block relative">
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
      Regions<ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
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
          right-0
          mt-3
          transform
          px-4
          z-10
        "
      >
        <div
          class="
            rounded-md
            shadow-2xl
            py-2
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            text-sm text-slate-700
            font-semibold
            bg-mission-gray
            dark:bg-slate-700
            energy:bg-gray-700
            dark:ring-0 dark:highlight-white/5 dark:text-slate-300
            energy:text-gray-300
            flex
          "
        >
          <div class="m-4 w-2/3">
            <RegionsListBox class="mb-6" />
            <RegionsMap aria-hidden="true" />
          </div>
          <div class="p-4 w-1/3">
            <RegionsList />
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>

  <!-- mobile/tablet version -->
  <Popover class="lg:hidden relative">
    <PopoverButton
      class="
        flex
        items-center
        hover:text-black
        dark:hover:text-white
        energy:text-white
      "
      tabindex="0"
    >
      Regions<ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
    </PopoverButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div>
        <PopoverPanel
          class="
            absolute
            left-2/3
            md:left-3/4
            lg:hidden
            z-10
            mt-3
            w-96
            md:w-max
            -translate-x-1/2
            transform
            px-4
          "
        >
          <div
            class="
              rounded-md
              shadow-2xl
              py-2
              p-2
              ring-1 ring-black ring-opacity-5
              focus:outline-none
              text-sm text-slate-700
              font-semibold
              bg-mission-gray
              dark:bg-slate-700
              energy:bg-gray-700
              dark:ring-0 dark:highlight-white/5 dark:text-slate-300
              energy:text-gray-300
              flex flex-col
              space-y-6
            "
          >
            <RegionsListBox class="mt-2" />
            <RegionsList
              class="
                pt-4
                border-t border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25
              "
            />
            <RegionsMap
              aria-hidden="true"
              class="
                pt-4
                border-t border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25
              "
            />
          </div>
        </PopoverPanel>
      </div>
    </transition>
  </Popover>
</template>

<script>
import RegionsMap from "./RegionsMap.vue";
import RegionsList from "./RegionsList.vue";
import RegionsListBox from "./RegionsListBox.vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";

export default {
  components: {
    RegionsMap,
    RegionsList,
    RegionsListBox,
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronDownIcon,
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>