<template>
  <div class="w-full flex grow bg-slate-100">
    <div class="hidden w-[300px] md:flex flex-col">
      <div class="font-semibold p-6 text-lg">Collections</div>
      <ul class="px-6 space-y-3 text-slate-600">
        <!-- <li class="flex items-center cursor-pointer hover:text-slate-900">
          <div class="w-[60px] h-[60px]">
            <img
              src="@/shared/assets/mocks/1x1_001_plane.jpg"
              alt=""
              class="rounded-full"
            />
          </div>
          <span class="ml-4">Travel</span>
        </li>
        <li
          class="flex items-center cursor-pointer font-semibold text-slate-900"
        >
          <div class="w-[60px] h-[60px]">
            <img
              src="@/shared/assets/mocks/1x1_003_china.jpg"
              alt=""
              class="rounded-full"
            />
          </div>
          <span class="ml-4 line-clamp-1">China Tensions</span>
        </li> -->
        <tippy content="Coming Soon" placement="bottom" theme="demo">
          <li class="flex items-center cursor-pointer h-[60px] text-sm">
            <PlusIcon class="h-5 w-5" />
            <span class="ml-4">New Collection</span>
          </li>
        </tippy>
      </ul>
    </div>
    <div
      class="w-full md:w-[calc(100%-300px)] bg-slate-50 border-l border-slate-200 p-8 flex md:block justify-center"
    >
      <div class="max-w-[475px] sm:max-w-[1450px]">
        <template v-if="collections.length == 0">
          <p class="italic">No collections to show</p>
        </template>
        <template v-else>
          <div class="text-2xl text-gray-700">China Tensions</div>
          <div class="py-6 sm:flex justify-between items-center">
            <div class="font-semibold mb-4 sm:mb-0">4 products</div>
            <div class="flex space-x-4">
              <!-- <Listbox
              v-model="selectedSort"
              as="div"
              class="min-w-[215px] inline-flex items-center text-gray-700"
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
                    selectedSort.name
                  }}</span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
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
                      v-for="item in sortOptions"
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
            </Listbox> -->
            </div>
          </div>
          <!-- <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          <template v-for="n in collectionProducts" :key="n">
            <MockProductCard :product="n" type="product" />
          </template>
        </div> -->
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "@/shared/config/wireAxios";
// import {
//   Listbox,
//   ListboxLabel,
//   ListboxButton,
//   ListboxOptions,
//   ListboxOption,
// } from "@headlessui/vue";
import {
  //   CheckIcon,
  //   ChevronDownIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    // Listbox,
    // ListboxLabel,
    // ListboxButton,
    // ListboxOptions,
    // ListboxOption,
    // CheckIcon,
    // ChevronDownIcon,
    PlusIcon,
  },
  setup() {
    const collections = ref([]);
    const loadingCollections = ref(true);
    // const numProducts = computed(() => mySaved.value.length);

    return {
      collections,
      loadingCollections,
      //   numProducts,
    };
  },
};
</script>
<style></style>
