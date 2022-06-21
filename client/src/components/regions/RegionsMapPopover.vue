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
          min-w-[48rem]
          right-0
          mt-3
          transform
          z-10
        "
      >
        <div
          class="
            shadow-2xl
            p-4
            w-full
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            text-slate-700
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
          <div class="flex items-center mb-4">
            <label for="country" aria-hidden="true"
              >Select a country from the map or the dropdown</label
            >
            <Listbox
              v-model="selectedCountry"
              aria-label="select a country from the dropdown"
            >
              <div class="relative w-1/2 ml-4">
                <ListboxButton
                  class="
                    flex
                    w-full
                    p-2
                    text-left
                    capitalize
                    bg-white
                    dark:bg-slate-600
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  "
                >
                  <span class="block truncate">{{ selectedCountry.name }}</span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <SelectorIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <ListboxOptions
                    class="
                      absolute
                      w-full
                      py-1
                      mt-1
                      overflow-auto
                      bg-white
                      dark:bg-slate-600
                      energy:bg-gray-600
                      rounded-md
                      shadow-lg
                      max-h-60
                      ring-1 ring-black ring-opacity-5
                      focus:outline-none
                      z-10
                    "
                  >
                    <ListboxOption
                      v-slot="{ active }"
                      v-for="country in countries"
                      :key="country"
                      :value="country"
                      as="template"
                      class="capitalize px-2 py-1 cursor-pointer"
                    >
                      <li
                        :class="[
                          active
                            ? 'bg-slate-200/80 dark:bg-slate-700 energy:bg-gray-700'
                            : 'bg-none',
                        ]"
                      >
                        {{ country.name }}
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
          <RegionsMap aria-hidden="true" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";
import { GlobeIcon, SelectorIcon } from "@heroicons/vue/outline";
import RegionsMap from "@/components/regions/RegionsMap";

import { countries } from "@/data/regions.js";

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Popover,
    PopoverButton,
    PopoverPanel,
    RegionsMap,
    GlobeIcon,
    SelectorIcon,
  },
  setup() {
    const selectedCountry = ref(countries[0]);

    return {
      countries,
      selectedCountry,
    };
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>