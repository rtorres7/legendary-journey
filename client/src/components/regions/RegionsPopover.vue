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
          min-w-[44rem]
          right-0
          mt-3
          transform
          z-10
        "
      >
        <div
          class="
            shadow-2xl
            p-6
            w-full
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            text-sm text-slate-700
            bg-mission-gray
            dark:bg-dark-space-blue
            energy:bg-gray-700
            border border-solid
            dark:border-slate-700
            border-t-0
            dark:ring-0 dark:highlight-white/5 dark:text-slate-300
            energy:text-gray-300
          "
        >
          <div class="hidden lg:block">
            <div
              class="grid grid-cols-3 gap-6 pb-4"
              aria-label="select a region or subregion"
            >
              <div v-for="region in regions" :key="region">
                <router-link to="" class="lg:text-lg hover:underline">{{
                  region.name
                }}</router-link>
                <ul class="pt-2 list-disc list-inside">
                  <template
                    v-for="subRegion in region.subRegions"
                    :key="subRegion"
                  >
                    <li v-if="subRegion.name != ''">
                      <router-link to="" class="hover:underline font-light">{{
                        subRegion.name
                      }}</router-link>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <p
              class="
                pt-4
                border-t border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25
              "
            >
              View a
              <a
                @click="openPDF"
                class="cursor-pointer underline"
                aria-label="View a PDF document with a list of countries that fall under each region and subregion"
              >
                list of countries
              </a>
              that fall under each region and subregion
            </p>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import { regions } from "@/data/regions.js";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronDownIcon,
  },
  data() {
    return {
      regions,
    };
  },
  methods: {
    openPDF() {
      window.open("/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf");
    },
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>