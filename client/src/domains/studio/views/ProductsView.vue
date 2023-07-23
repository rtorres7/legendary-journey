<template>
  <div>
    <div class="pt-8 pb-6">
      <div class="flex justify-between pb-8">
        <div class="text-3xl font-semibold text-gray-700 lg:max-w-none">
          Products
        </div>
        <button
          class="inline-flex items-center justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80 cursor-pointer"
        >
          <PlusIcon class="h-4 w-4" />
          <span class="ml-2.5">New Product</span>
        </button>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-gray-500 font-medium">16 products</div>
        <div class="flex space-x-4">
          <Listbox
            v-model="selectedSortProduct"
            as="div"
            class="min-w-[260px] hidden md:inline-flex items-center text-gray-700"
          >
            <div>
              <ListboxLabel
                class="text-sm line-clamp-1 xl:line-clamp-none w-max"
              >
                Sort By
              </ListboxLabel>
            </div>
            <div class="w-full relative items-center ml-3">
              <ListboxButton
                class="relative w-full min-h-[2.125rem] rounded cursor-default pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
              >
                <span class="text-sm block truncate capitalize">{{
                  selectedSortProduct.name
                }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
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
                  class="absolute w-full py-1 mt-1 overflow-auto text-gray-900 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
                >
                  <ListboxOption
                    v-for="item in sortOptionsProducts"
                    v-slot="{ active, selected }"
                    :key="item.name"
                    :value="item"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-gray-100  ' : 'bg-none',
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate text-sm',
                        ]"
                        >{{ item.name }}</span
                      >
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                      >
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
          <button
            class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
          >
            <span class="hidden md:block">Filters</span>
            <span class="block md:hidden">Filters / Sort</span>
            <AdjustmentsHorizontalIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
    >
      <template v-for="n in products" :key="n">
        <ProductCard :product="n" type="product" />
      </template>
    </div>
  </div>
</template>
<script>
import { products } from "../data";
import { ref } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import ProductCard from "@studio/components/ProductCard.vue";
export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    AdjustmentsHorizontalIcon,
    CheckIcon,
    ChevronDownIcon,
    PlusIcon,
    ProductCard,
  },
  setup() {
    const sortOptionsProducts = [
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];
    const selectedSortProduct = ref(sortOptionsProducts[0]);

    return {
      sortOptionsProducts,
      selectedSortProduct,
      products,
    };
  },
};
</script>
<style lang="scss"></style>
