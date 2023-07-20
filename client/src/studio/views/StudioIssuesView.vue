<template>
  <div>
    <div class="pt-8 pb-6">
      <div class="flex justify-between pb-8">
        <div class="text-3xl font-semibold text-gray-700 lg:max-w-none">
          Issues
        </div>
        <button
          class="inline-flex items-center justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80 cursor-pointer"
          @click="openEdit"
        >
          <PlusIcon class="h-4 w-4" />
          <span class="ml-2.5">New Issue</span>
        </button>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-gray-500 font-medium">6 issues</div>
        <div class="flex space-x-4">
          <Listbox
            v-model="selectedSort"
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
                  selectedSort.name
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
      <template v-for="n in issues" :key="n">
        <MockIssueCard :issue="n" />
      </template>
    </div>
  </div>
  <TransitionRoot appear :show="isEditOpen" as="template">
    <Dialog as="div" @close="closeEdit">
      <div class="fixed inset-0 z-20 overflow-y-auto w-full">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="inline-block w-full min-w-[300px] sm:min-w-[600px] lg:min-w-[900px] h-[90vh] max-w-sm p-8 my-8 text-left overflow-auto align-middle transition-all transform text-gray-900 bg-white shadow-lg rounded-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                tabindex="0"
                @click="closeEdit"
              >
                <span class="sr-only">Close navigation</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="text-3xl font-semibold text-gray-700 py-8">
                New Issue
              </div>
              <div class="flex flex-col space-y-8">
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Basics</div>
                    <div class="text-sm text-gray-600">
                      The information below will feature on the main page.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-6">
                    <div class="max-w-[600px]">
                      <label class="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        aria-labelledby="4"
                        autocomplete="off"
                        class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-2 bg-transparent border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                      />
                    </div>
                    <div class="flex space-x-6">
                      <div class="max-w-[250px]">
                        <label id="2" class="text-sm font-medium"
                          >Start Date</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="2"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="max-w-[250px]">
                        <label id="3" class="text-sm font-medium"
                          >Expires On</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="3"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Content</div>
                    <div class="text-sm text-gray-600">
                      The top three products are shown with their thumbnails.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-8">
                    <div class="text-sm">
                      <div class="font-medium">Breaking Product</div>
                      <Switch
                        v-model="breakingEnabled"
                        :class="breakingEnabled ? 'bg-blue-700' : 'bg-gray-300'"
                        class="relative inline-flex mt-3 h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          :class="
                            breakingEnabled ? 'translate-x-9' : 'translate-x-0'
                          "
                          class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <div class="mt-2 text-gray-600">
                        The top product will have a breaking label.
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-sm">Products</div>
                      <div class="flex mt-3">
                        <ul
                          class="w-full rounded-md max-w-[800px] border border-dashed border-gray-400"
                        >
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Top Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px]"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-end items-center space-x-6 mt-8 pt-8 border-t border-gray-200 text-sm"
              >
                <button
                  class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                >
                  Create
                </button>
                <button class="font-medium text-blue-700" @click="closeEdit">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import { issues, products } from "../data";
import { onMounted, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import MockIssueCard from "@/demo-studio/components/MockIssueCard.vue";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Dialog,
    DialogPanel,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    AdjustmentsHorizontalIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    PlusIcon,
    XMarkIcon,
    MockIssueCard,
    Switch,
    TransitionChild,
    TransitionRoot,
  },
  setup() {
    const currentHash = ref(window.location.hash || "#dashboard");
    const sortOptions = [
      { name: "Start Date: Recent" },
      { name: "Start Date: Last" },
    ];
    const sortOptionsProducts = [
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];
    const breakingEnabled = ref(false);
    const isEditOpen = ref(false);
    const selectedSort = ref(sortOptions[0]);
    const selectedSortProduct = ref(sortOptionsProducts[0]);
    const hover = ref(false);

    onMounted(() => {
      window.location.hash = window.location.hash || "#home";
    });

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

    const getImg = (src) => {
      //return new URL("../../assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../assets/mocks/${src}`, import.meta.url).href;
    };

    const getPosition = (index, total) => {
      if (index === 0) {
        return "first";
      }
      if (index === total - 1) {
        return "last";
      }
      return null;
    };

    const closeEdit = () => {
      isEditOpen.value = false;
    };

    const openEdit = () => {
      isEditOpen.value = true;
    };

    return {
      dayjs,
      themeOptions,
      sortOptions,
      sortOptionsProducts,
      breakingEnabled,
      isEditOpen,
      selectedSort,
      selectedSortProduct,
      hover,
      issues,
      products,
      isActivePage,
      getImg,
      getPosition,
      closeEdit,
      openEdit,
    };
  },
};
</script>
<style lang="scss"></style>
