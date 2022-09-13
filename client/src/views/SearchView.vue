<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <p class="font-semibold text-2xl">Search</p>
  </div>
  <!-- Results Container -->
  <template v-if="loading">
    <div class="max-w-fit m-auto mt-[20vh]">
      <svg
        class="
          animate-spin
          -ml-1
          mr-3
          h-24
          w-24
          text-mission-blue
          dark:text-slate-300
          energy:text-zinc-300
        "
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </template>
  <template v-if="!loading && totalCount === 0">
    <div class="mt-6">
      <p class="text-xl text-center font-semibold">
        Sorry, we didn't find any results.
      </p>
      <p class="text text-center">
        Here's some information about your keyword search that might help you
        find what you're looking for.
      </p>
    </div>
  </template>
  <template v-if="!loading && totalCount > 0">
    <div class="flex flex-col-reverse lg:flex-row py-4">
      <!-- Search Results & Sorting Listbox (Left) -->
      <div class="h-fit basis-4/5">
        <!-- Search Sorting Listbox -->
        <div class="hidden lg:flex justify-between py-4">
          <div class="flex gap-x-8">
            <div class="inline-flex">
              <label class="self-center font-medium text-sm">Sort By</label>
              <Listbox v-model="selectedOrder" class="ml-3 min-w-[115px]">
                <div class="relative">
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
                      dark:bg-slate-700
                      energy:bg-zinc-700
                      border-t border-t-gray-100
                      dark:border-t-slate-800
                      energy:border-t-zinc-800
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate">{{
                      selectedOrder.label
                    }}</span>
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
                        dark:bg-slate-700
                        energy:bg-zinc-700
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
                        v-for="item in sortOptions"
                        :key="item"
                        :value="item"
                        as="template"
                        class="capitalize px-2 py-1 cursor-pointer"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                              : 'bg-none',
                          ]"
                        >
                          {{ item.label }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
        <!-- Search Results Table -->
        <BaseCard>
          <!-- Top Pagination -->
          <div
            class="
              px-4
              py-3
              flex
              items-center
              border-b border-gray-200
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/50
            "
          >
            <SearchResultsTablePagination
              :totalCount="totalCount"
              :currentPage="currentPage"
            />
          </div>
          <!-- Results -->
          <template v-for="result in results" :key="result">
            <div
              class="
                flex
                p-4
                border-b border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-zinc-700/50
              "
            >
              <div class="h-fit px-2 text-center">
                <span class="block font-semibold">{{
                  dayjs(result.item.publication_date).format("DD")
                }}</span>
                <span class="block text-sm">{{
                  dayjs(result.item.publication_date).format("MMM")
                }}</span>
                <span class="block text-sm">{{
                  dayjs(result.item.publication_date).format("YYYY")
                }}</span>
              </div>
              <div class="px-2 w-full">
                <div class="flex justify-between mb-2">
                  <router-link
                    :to="{
                      name: 'article',
                      params: { doc_num: result.item.doc_num },
                    }"
                  >
                    <div
                      class="
                        basis-[768px]
                        cursor-pointer
                        hover:underline
                        line-clamp-2
                      "
                    >
                      <span
                        class="
                          text-slate-600
                          dark:text-slate-300
                          energy:text-zinc-300
                        "
                        >{{
                          `${"(" + result.item.title_classification + ") "}`
                        }}</span
                      >
                      <span
                        class="text-black dark:text-white energy:text-white"
                        >{{ result.item.title }}</span
                      >
                    </div>
                  </router-link>
                  <div class="text-xs lg:text-sm">
                    {{ result.item.doc_num }}
                  </div>
                </div>
                <div
                  class="
                    text-sm text-slate-600
                    dark:text-slate-300
                    energy:text-zinc-300
                    line-clamp-3
                  "
                >
                  {{ result.item.summary }}
                </div>
              </div>
            </div>
          </template>
          <!-- Bottom Pagination -->
          <div
            class="
              px-4
              py-3
              flex
              items-center
              border-t border-gray-200
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/50
            "
          >
            <SearchResultsTablePagination
              :totalCount="totalCount"
              :currentPage="currentPage"
            />
          </div>
        </BaseCard>
      </div>
      <!-- Search Results Filters -->
      <div class="lg:hidden flex justify-between gap-4 py-4">
        <div class="flex gap-y-4 sm:gap-y-0 sm:gap-x-4 flex-col sm:flex-row">
          <div class="inline-flex">
            <label class="self-center min-w-[58px] sm:min-w-0">Sort By</label>
            <Listbox v-model="selectedOrder" class="ml-3 min-w-[110px]">
              <div class="relative">
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
                    dark:bg-slate-700
                    energy:bg-zinc-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-zinc-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  "
                >
                  <span class="block truncate">{{ selectedOrder.label }}</span>
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
                      dark:bg-slate-700
                      energy:bg-zinc-700
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
                      v-for="item in sortOptions"
                      :key="item"
                      :value="item"
                      as="template"
                      class="capitalize px-2 py-1 cursor-pointer"
                    >
                      <li
                        :class="[
                          active
                            ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                            : 'bg-none',
                        ]"
                      >
                        {{ item.label }}
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { SelectorIcon } from "@heroicons/vue/outline";
import SearchResultsTablePagination from "@/components/SearchResultsTablePagination";

const sortOptions = [
  { label: "Newest", key: "desc" },
  { label: "Oldest", key: "asc" },
];

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    SelectorIcon,
    SearchResultsTablePagination,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const loading = computed(() => store.state.danielSearch.loading);
    const results = computed(() => store.state.danielSearch.results);
    const totalCount = computed(() => store.state.danielSearch.totalCount);

    const selectedOrder = ref(
      route.query.sort_dir === "asc" ? sortOptions[1] : sortOptions[0]
    );

    const currentPage = ref(parseInt(route.query.page) || 1);

    onMounted(() => {
      store.dispatch("danielSearch/search");
    });

    watch([selectedOrder], () => {
      router.push({
        query: {
          ...route.query,
          sort_dir: selectedOrder.value.key,
        },
      });
    });

    watch(
      () => route.query,
      () => {
        console.log("route.query watcher triggered.");
        if (route.name === "search") {
          store.dispatch("danielSearch/search");
          currentPage.value = parseInt(route.query.page) || 1;
        }
      }
    );

    return {
      dayjs,
      loading,
      results,
      selectedOrder,
      sortOptions,
      totalCount,
      currentPage,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
