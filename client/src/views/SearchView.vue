<template>
  <p
    class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    Search
  </p>
  <div class="py-4">
    <Disclosure v-slot="{ open }">
      <div class="flex justify-between">
        <div class="flex space-x-6 max-w-[1280px] w-full">
          <div class="basis-2/5">
            <label>
              <span class="text-sm font-semibold"
                >Keyword Search or Filter</span
              >
              <input
                class="
                  mt-1
                  block
                  w-full
                  focus-visible:outline-none
                  border-b
                  bg-transparent
                  border-b border-gray-300
                  energy:text-gray-300
                  border-b border-gray-300
                "
              />
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold"
                >Regions, Subregions & Countries</span
              >
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold">Issues & Topics</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold"
                >Reporting & Product Types</span
              >
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
        </div>
        <DisclosureButton class="py-2 basis-[100px]">
          <div class="flex mx-4">
            <span class="text-sm mr-2">{{ open ? "Less" : "More" }}</span>
            <ChevronUpIcon
              :class="open ? 'rotate-180 transform' : ''"
              class="h-5 w-5"
            />
          </div>
        </DisclosureButton>
      </div>
      <DisclosurePanel class="my-3">
        <div class="flex space-x-6 max-w-[1280px]">
          <div class="basis-2/5 flex space-x-6">
            <label class="block basis-1/2">
              <span class="text-sm font-semibold">Classifications</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
            <label class="block basis-1/2">
              <span class="text-sm font-semibold">Media Types</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold">Non State Actors</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold">Producing Offices</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
          <div class="basis-1/5">
            <label class="block">
              <span class="text-sm font-semibold">Front Page Featured</span>
              <Listbox
                v-model="selectedItem"
                aria-label="select a country from the dropdown"
              >
                <div class="relative mt-1">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
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
                    <span class="block truncate">{{ selectedItem }}</span>
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
                        v-for="item in testList"
                        :key="item"
                        :value="item"
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
                          {{ item }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </label>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
  <div>{{ results }}</div>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronUpIcon, SelectorIcon } from "@heroicons/vue/outline";

const testList = [
  "test item 1",
  "test item 2",
  "test item 3",
  "test item 4",
  "test item 5",
];

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronUpIcon,
    SelectorIcon,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const results = computed(() => store.state.search.results);

    const selectedItem = ref("");

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch(
      () => route.query,
      () => {
        store.dispatch("search/search");
      }
    );

    return {
      selectedItem,
      testList,
      results,
    };
  },
};
</script>

<style>
</style>
