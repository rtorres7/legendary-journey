<template>
  <div class="h-full flex flex-col md:flex-row">
    <StudioNavigation />
    <div class="flex flex-col grow min-h-screen h-full">
      <div class="relative grow">
        <!-- Content Area -->
        <div
          class="flex flex-col text-gray-900 w-full min-h-[calc(100vh-4rem)] h-full items-center bg-slate-50"
        >
          <div
            class="max-w-[475px] sm:max-w-[768px] xl:max-w-[1600px] w-full p-6 md:p-8"
          >
            <!-- Home -->
            <div :class="isActivePage('#home') ? 'block' : 'hidden'">
              <div
                class="flex space-x-1 justify-center xl:justify-start text-2xl py-8"
              >
                <div class="text-gray-700 font-bold uppercase tracking-wider">
                  Current
                </div>
                <div class="text-gray-500 font-medium">Issue</div>
              </div>
              <div class="">
                <MockLiveIssueCard :issue="issues[0]" />
                <div
                  class="py-8 flex justify-center xl:justify-between items-center"
                >
                  <div class="text-2xl font-bold text-gray-700">
                    Coming Soon
                  </div>
                  <a
                    class="hidden xl:block text-gray-500 hover:text-gray-700 text-sm font-medium"
                    href="/studio#issues"
                  >
                    See All
                  </a>
                </div>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
                >
                  <MockIssueCard :issue="issues[1]" />
                  <MockIssueCard :issue="issues[2]" />
                  <MockIssueCard :issue="issues[3]" class="hidden xl:flex" />
                </div>
                <a
                  class="block xl:hidden text-end py-8 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  href="/studio#issues"
                >
                  See All
                </a>
                <!-- <div
                class="text-xl font-bold text-gray-700 uppercase tracking-wider py-8"
              >
                Analytics
                top authors
                total issues created
                longest running issue
              </div> -->
              </div>
            </div>
            <!-- Live Content-->
            <div :class="isActivePage('#live') ? 'block' : 'hidden'">
              <!-- <div class="text-2xl text-gray-700">Responsive Check</div>
              <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div> -->
              <!-- <div class="flex items-center space-x-2">
                <span class="relative flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                  ></span>
                </span>
                <span class="text-sm font-semibold tracking-wider uppercase"
                  >Live Now</span
                >
              </div> -->
              <div class="max-w-[1480px] flex space-x-4 justify-end">
                <button
                  class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                >
                  <span>Edit</span>
                  <PencilSquareIcon class="h-5 w-5" />
                </button>
                <button
                  class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 border border-gray-300"
                >
                  <span>Preview</span>
                  <DocumentMagnifyingGlassIcon class="h-5 w-5" />
                </button>
              </div>
              <div class="py-8">
                <div class="text-blue-600 font-medium text-sm">
                  Changes in 4 days
                </div>
                <div class="text-5xl py-2 font-bold">
                  {{ issues[0].title }}
                </div>
                <div class="flex flex-col py-2 space-y-2 font-medium text-sm">
                  <p>By {{ issues[0].author }}</p>
                  <p class="text-gray-400">
                    Updated {{ issues[0].last_updated }}
                  </p>
                </div>
              </div>
              <div class="pb-6 font-semibold text-gray-700">
                Featured Products
              </div>
              <div class="max-w-[1500px] grid grid-cols-1 xl:grid-cols-3 gap-2">
                <template
                  v-for="product in issues[0].featured.slice(0, 3)"
                  :key="product"
                >
                  <div
                    class="flex flex-col max-w-[768px] xl:max-w-[480px] px-6 py-4 bg-white rounded-md shadow-sm hover:shadow-md border border-slate-200 cursor-pointer"
                  >
                    <div class="max-h-[432px] xl:max-h-[270px] cursor-pointer">
                      <img
                        :src="getImg(product.src)"
                        class="rounded-md"
                        alt=""
                      />
                    </div>
                    <div class="h-full flex flex-col justify-between">
                      <div class="py-4">
                        <p
                          class="font-semibold text-lg line-clamp-2 xl:line-clamp-3"
                        >
                          <span class="text-gray-500">{{
                            product.classification
                          }}</span>
                          {{ product.title }}
                        </p>
                      </div>
                      <div class="flex space-x-2 font-medium text-sm">
                        <div class="text-blue-700">{{ product.type }}</div>
                        <div>•</div>
                        <div class="text-gray-500">
                          {{ product.date_posted }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div class="font-semibold text-gray-700 py-6">More Products</div>
              <div
                class="max-w-[800px] bg-white rounded-md border border-slate-200"
              >
                <ul>
                  <template
                    v-for="product in issues[0].featured.slice(3)"
                    :key="product"
                  >
                    <li class="px-6 border-b border-gray-200 cursor-pointer">
                      <div class="py-4">
                        <p class="font-semibold text-lg line-clamp-2">
                          <span class="text-gray-500">{{
                            product.classification
                          }}</span>
                          {{ product.title }}
                        </p>
                      </div>
                      <div class="pb-4 flex space-x-2 font-medium text-sm">
                        <div class="text-blue-700">{{ product.type }}</div>
                        <div>•</div>
                        <div class="text-gray-500">
                          {{ product.date_posted }}
                        </div>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <!-- Issues -->
            <div :class="isActivePage('#issues') ? 'block' : 'hidden'">
              <div class="pt-8 pb-6">
                <div class="flex justify-between pb-8">
                  <div
                    class="text-3xl font-semibold text-gray-700 lg:max-w-none"
                  >
                    Issues
                  </div>
                  <a
                    class="inline-flex items-center justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80 cursor-pointer"
                  >
                    <PlusIcon class="h-4 w-4" />
                    <span class="ml-2.5">New Issue</span></a
                  >
                </div>
                <div class="flex justify-between items-center">
                  <div class="text-gray-500">6 issues</div>
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
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2"
                          >
                            <ChevronDownIcon
                              class="h-4 w-4"
                              aria-hidden="true"
                            />
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
                                  <CheckIcon
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                  />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import { issues } from "../data";
import { onMounted, ref } from "vue";
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
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import MockIssueCard from "@/demo-studio/components/MockIssueCard.vue";
import MockLiveIssueCard from "@/demo-studio/components/MockLiveIssueCard.vue";
import StudioNavigation from "@/demo-studio/components/StudioNavigation.vue";
const themeOptions = ["light", "dark", "system"];
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
    DocumentMagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    MockIssueCard,
    MockLiveIssueCard,
    StudioNavigation,
  },
  setup() {
    const currentHash = ref(window.location.hash || "#dashboard");
    const sortOptions = [
      { name: "Posting Date: Recent" },
      { name: "Posting Date: Last" },
    ];

    const selectedSort = ref(sortOptions[0]);

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
      return new URL("../../assets/mocks/" + src, import.meta.url).href;
    };

    return {
      dayjs,
      themeOptions,
      sortOptions,
      selectedSort,
      issues,
      isActivePage,
      getImg,
    };
  },
};
</script>
<style lang="scss"></style>
