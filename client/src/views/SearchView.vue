<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
  >
    <p v-show="!loadingMetadata" class="pb-2">
      {{ pageSubheader }}
    </p>
    <p class="font-semibold text-2xl">
      {{ pageHeader }}
    </p>
  </div>
  <!-- Search Form -->
  <div class="flex flex-row-reverse py-1 my-2">
    <template v-if="loadingMetadata">
      <div
        class="h-8 w-16 animate-pulse bg-white dark:bg-slate-800/50 energy:bg-zinc-800 rounded"
      />
    </template>
    <template v-else>
      <button
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
        @click="clearFilters"
      >
        Clear All
      </button>
    </template>
  </div>
  <MaxCard
    :class="[
      'p-4',
      loadingMetadata
        ? 'animate-pulse h-[35rem] md:h-[23rem] lg:h-[12.5rem]'
        : '',
    ]"
  >
    <div v-show="!loadingMetadata">
      <Disclosure v-slot="{ open }" default-open>
        <div class="flex flex-col justify-between">
          <div
            class="grid-cols-1 md:grid md:gap-4 space-y-3 md:space-y-0 lg:flex lg:space-x-6 lg:gap-0 flex-col lg:flex-row w-full"
          >
            <div class="lg:w-1/2 flex space-x-3">
              <div class="w-full">
                <MaxInput
                  v-model="queryText"
                  label="Keyword Search or Query"
                  type="text"
                  autocomplete="off"
                  placeholder="Press enter after typing"
                  :disabled="queryDisabled"
                  @keyup.enter="searchQueryText"
                />
              </div>
              <div class="flex flex-col mt-1 justify-between">
                <label class="text-sm font-medium">Date</label>
                <MaxDatepicker
                  v-model="queryDateRange"
                  :enable-time-picker="false"
                  range
                  multi-calendars
                  @update:modelValue="handleDateRange"
                >
                  <template #trigger>
                    <button>
                      <CalendarIcon
                        class="cursor-pointer hover:text-black dark:hover:text-white energy:hover:text-white h-9 w-9"
                      />
                      <span class="sr-only"
                        >select a date from the calendar</span
                      >
                    </button>
                  </template>
                  <template #left-sidebar>
                    <div
                      class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow p-4 flex flex-col text-sm space-y-6"
                    >
                      <button @click="selectDate('24H')">Past 24 Hours</button>
                      <button @click="selectDate('1WK')">Past Week</button>
                      <button @click="selectDate('1MO')">Past Month</button>
                      <button @click="selectDate('6MO')">Past 6 Months</button>
                      <button @click="selectDate('1YR')">Past Year</button>
                    </div>
                  </template>
                </MaxDatepicker>
              </div>
            </div>
            <template
              v-for="n in [queryFilters.regions, queryFilters.issues]"
              :key="n"
            >
              <div class="lg:w-1/4 self-end">
                <component
                  :is="n.component"
                  v-model="n.model"
                  :label="n.label"
                  :items="n.list"
                  multiple
                />
              </div>
            </template>
          </div>
          <DisclosureButton
            class="py-3 lg:py-1 max-w-fit hover:text-black dark:hover:text-white energy:hover:text-whit"
          >
            <span
              class="text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow mr-2 inline-block"
              >{{ open ? "Less" : "More" }}</span
            >
            <ChevronUpIcon
              :class="open ? '' : 'rotate-180 transform'"
              class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow h-5 w-5 inline-block"
            />
          </DisclosureButton>
        </div>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <DisclosurePanel class="my-2">
            <div class="flex flex-col lg:flex-row space-y-3 lg:space-y-0">
              <div class="lg:w-1/2 flex space-x-4 lg:max-w-none lg:pr-6">
                <template v-if="!loadingMetadata">
                  <template
                    v-for="n in [
                      queryFilters.classifications,
                      queryFilters.reporting,
                    ]"
                    :key="n"
                  >
                    <div class="w-full lg:w-1/2">
                      <component
                        :is="n.component"
                        v-model="n.model"
                        :label="n.label"
                        :items="n.list"
                        multiple
                      />
                    </div>
                  </template>
                </template>
              </div>
              <div
                class="grid grid-cols-2 gap-4 lg:gap-0 lg:grid-cols-0 lg:flex lg:w-1/2 lg:space-x-6 lg:max-w-none"
              >
                <template
                  v-for="n in [
                    queryFilters.media_types,
                    queryFilters.producing_offices,
                    // queryFilters.nonstate_actors,
                    // queryFilters.frontpage_featured,
                  ]"
                  :key="n"
                >
                  <div class="lg:w-1/2">
                    <component
                      :is="n.component"
                      v-model="n.model"
                      :label="n.label"
                      :items="n.list"
                      :disabled="n.disabled || false"
                      multiple
                    />
                  </div>
                </template>
              </div>
            </div>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>
  </MaxCard>
  <div class="flex flex-row-reverse py-1 mt-2">
    <template v-if="!loadingMetadata && booleanFilters.length > 0">
      <button
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
        @click="toggleSelectors"
      >
        {{
          showSelectors
            ? "Hide Selectors"
            : `Show Selectors (${booleanFilters.length})`
        }}
      </button>
    </template>
  </div>
  <!-- Search Boolean Selectors -->
  <template
    v-if="!loadingMetadata && showSelectors && booleanFilters.length > 0"
  >
    <MaxCard class="mt-2 px-4 py-2 w-fit text-sm">
      <div class="flex flex-wrap">
        <template v-for="(n, index) in booleanFilters" :key="n">
          <div
            class="my-2"
            :class="[
              n.lastItem && index < booleanFilters.length - 1
                ? 'pr-3 border-r border-slate-700/50 energy:border-zinc-700/50'
                : 'pr-2',
              index !== 0 && n.firstItem ? 'pl-3' : '',
            ]"
          >
            <div
              class="flex rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
            >
              <div class="self-center pr-1">
                <template v-if="n.type === 'text'">
                  <span class="pr-1 italic">Text: </span>
                </template>
                <template v-if="n.type === 'query'">
                  <span class="pr-1 italic">Query: </span>
                </template>
                {{ n.displayName }}
              </div>
              <button
                type="button"
                class="w-5 h-5 flex items-center justify-center"
                tabindex="0"
                @click="removeFilter(n)"
              >
                <span class="sr-only">Remove filter</span>
                <XMarkIcon
                  class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <template v-if="!n.lastItem">
            <template v-if="n.toggleable">
              <button
                class="mr-3 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                @click="toggleBooleanValue(n)"
              >
                {{ n.boolean_val }}
              </button>
            </template>
            <template v-else>
              <div class="mr-3 self-center">
                {{ n.boolean_val }}
              </div>
            </template>
          </template>
        </template>
      </div>
    </MaxCard>
  </template>
  <!-- Results Container -->
  <template v-if="loadingResults">
    <template v-if="selectedView.name === 'List'">
      <div class="flex flex-col-reverse lg:flex-row py-4">
        <div class="h-fit basis-3/4">
          <div class="hidden lg:flex justify-between py-4">
            <div class="flex gap-x-8">
              <template v-for="n in 3" :key="n">
                <MaxCard class="animate-pulse h-[34px] w-40" />
              </template>
            </div>
          </div>
          <MaxCard class="animate-pulse">
            <div
              class="flex items-center py-3 px-4 border-b border-gray-200 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
            >
              <div class="flex-1 flex items-center justify-between">
                <div
                  class="h-[20px] w-[200px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                ></div>
                <div
                  class="rounded h-[40px] w-[150px] md:w-[300px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                ></div>
              </div>
            </div>
            <ol>
              <template v-for="n in 10" :key="n">
                <li
                  class="border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-50/[0.06] last:border-b-0"
                >
                  <div class="flex p-4 h-[113px]">
                    <div
                      class="mx-2 w-[50px] h-[64px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                    ></div>
                    <div class="relative mx-2 w-full">
                      <div
                        class="h-[20px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                      ></div>
                      <div
                        class="h-[40px] my-2 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                      ></div>
                    </div>
                  </div>
                </li>
              </template>
            </ol>
          </MaxCard>
        </div>
        <div class="hidden lg:block basis-1/4 ml-4">
          <MaxCard class="animate-pulse h-[910px] w-full">
            <div class="flex flex-col p-4">
              <template v-for="n in 6" :key="n">
                <div class="h-[115px] my-4">
                  <div
                    class="h-[20px] w-[125px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                  ></div>
                  <template v-for="j in 4" :key="j">
                    <div
                      class="my-2 h-[15px] w-[200px] bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
                    ></div>
                  </template>
                </div>
              </template>
            </div>
          </MaxCard>
        </div>
        <div class="lg:hidden flex justify-between gap-4 py-4">
          <div class="flex gap-y-4 md:gap-y-0 md:gap-x-4 flex-col md:flex-row">
            <template v-for="n in 3" :key="n">
              <MaxCard class="animate-pulse h-[34px] w-40" />
            </template>
          </div>
          <div
            class="h-[24px] w-[92px] self-end md:self-center bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="max-w-fit m-auto mt-[20vh]">
        <svg
          class="animate-spin -ml-1 mr-3 h-24 w-24 text-mission-blue dark:text-slate-300 energy:text-zinc-300"
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
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg></div
    ></template>
  </template>
  <template v-if="!loadingResults && totalCount === 0">
    <div class="mt-6">
      <p class="text-xl text-center font-semibold">
        Sorry, we didn't find any results.
      </p>
      <p class="text text-center">
        Here's some information about your keyword search that might help you
        find what you're looking for:
      </p>
      <p class="text-center font-semibold">
        <router-link class="hover:underline" to="/search_tips/" target="_blank"
          >Advanced Search Tips</router-link
        >
      </p>
    </div>
  </template>
  <template v-if="!loadingResults && totalCount > 0">
    <div class="flex flex-col-reverse lg:flex-row py-4">
      <!-- Search Results & Sorting Listbox (Left) -->
      <div
        class="h-fit"
        :class="[
          selectedView.name === 'Grid' || selectedView.name === 'Visuals'
            ? 'basis-full'
            : 'basis-3/4',
        ]"
      >
        <!-- Search Sorting Listbox -->
        <div class="hidden lg:flex justify-between py-4">
          <div class="flex gap-x-8">
            <MaxAppListbox
              v-model="selectedSort"
              label="Sort By"
              :items="sortOptions"
            />
            <MaxAppListbox
              v-model="selectedView"
              label="View"
              :items="viewOptions"
            />
            <MaxAppListbox
              v-model="selectedResultCount"
              label="Results Per Page"
              :items="resultOptions"
            />
          </div>
          <div
            v-show="
              selectedView.name === 'Grid' || selectedView.name === 'Visuals'
            "
            class="cursor-pointer text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow self-center"
            @click="openMobileFacetsDialog"
          >
            Show Filters
          </div>
        </div>
        <!-- Search Results Table -->
        <MaxTable
          :items="results"
          :totalCount="totalCount"
          :currentPage="currentPage"
          :isGrid="selectedView.name === 'Grid'"
          :maxPerPage="selectedResultCount.key"
        >
          <template #default="{ item }">
            <div
              class="flex p-4"
              :class="
                isProductLocked(item)
                  ? 'bg-slate-200/50 dark:bg-slate-700 energy:bg-zinc-700'
                  : ''
              "
              :aria-label="isProductLocked(item) ? 'restricted product' : ''"
              :title="
                isProductLocked(item)
                  ? 'This product has restricted access.'
                  : ''
              "
            >
              <div class="h-fit px-2 text-center">
                <span class="block font-semibold">{{
                  dayjs(item.date_published).format("DD")
                }}</span>
                <span class="block text-sm">{{
                  dayjs(item.date_published).format("MMMM")
                }}</span>
                <span class="block text-sm">{{
                  dayjs(item.date_published).format("YYYY")
                }}</span>
              </div>
              <div class="relative px-2 w-full">
                <template v-if="isProductLocked(item)">
                  <MaxProductIcon
                    class="absolute w-16 h-16 m-auto inset-x-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
                    icon="locked"
                  />
                </template>
                <div class="flex justify-between">
                  <div
                    class="basis-[768px] hover:underline wrap-anywhere"
                    :class="isProductLocked(item) ? '' : 'cursor-pointer'"
                  >
                    <ProductRestrictedLink :product="item">
                      <span
                        class="text-slate-600 dark:text-slate-300 energy:text-zinc-300"
                        >{{ `${"(" + item.title_classification + ") "}` }}</span
                      >

                      <span
                        class="text-black dark:text-white energy:text-white"
                        >{{ item.title }}</span
                      >
                    </ProductRestrictedLink>
                  </div>
                  <div class="text-xs lg:text-sm">
                    {{ item.doc_num }}
                  </div>
                </div>
                <div
                  class="py-2 text-sm text-slate-600 dark:text-slate-300 energy:text-zinc-300 wrap-anywhere"
                >
                  <template v-if="showHighlightedResult()">
                    <span
                      class="line-clamp-5"
                      v-html="item.highlighted_result"
                    />
                  </template>
                  <template v-else>
                    <span class="line-clamp-5">{{ item.summary }}</span>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template #grid="{ item }">
            <div class="w-full h-[288px] md:max-w-[575px]">
              <ProductRestrictedLink :product="item">
                <PublishedProductCard :product="item" />
              </ProductRestrictedLink>
            </div>
          </template>
        </MaxTable>
      </div>
      <!-- Search Results Filters -->
      <MaxCard
        v-show="selectedView.name === 'List'"
        class="hidden lg:block basis-1/4 ml-4 h-full"
      >
        <SearchResultsFacets :facets="aggregations" />
      </MaxCard>
      <div class="lg:hidden flex justify-between gap-4 py-4">
        <div class="flex gap-y-4 md:gap-y-0 md:gap-x-4 flex-col md:flex-row">
          <MaxAppListbox
            v-model="selectedSort"
            label="Sort By"
            :items="sortOptions"
          />
          <MaxAppListbox
            v-model="selectedView"
            label="View"
            :items="viewOptions"
          />
          <MaxAppListbox
            v-model="selectedResultCount"
            label="Results Per Page"
            :items="resultOptions"
          />
        </div>
        <div
          class="cursor-pointer text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow self-end md:self-center"
          @click="openMobileFacetsDialog"
        >
          Show Filters
        </div>
      </div>
      <!-- Mobile Result Facets Dialog -->
      <TransitionRoot appear :show="isMobileFacetsDialogOpen" as="template">
        <Dialog as="div" @close="closeMobileFacetsDialog">
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
              <span
                class="inline-block h-screen align-middle"
                aria-hidden="true"
              >
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
                  class="inline-block w-full max-w-xl md:max-w-[700px] lg:max-w-[900px] p-6 my-8 text-left align-middle transition-all transform text-slate-700 dark:text-slate-300 energy:text-zinc-300 bg-slate-100 dark:bg-slate-700 energy:bg-zinc-700 shadow-lg rounded-lg"
                >
                  <div class="mt-6">
                    <button
                      type="button"
                      class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                      tabindex="0"
                      @click="closeMobileFacetsDialog"
                    >
                      <span class="sr-only">Close navigation</span>
                      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                    <SearchResultsFacets
                      :facets="aggregations"
                      class="grid grid-cols-2 md:grid-cols-3 gap-4"
                    />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import {
  isProductLocked,
  getValueForCode,
  getValueForName,
  formatDate,
} from "@/helpers";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CalendarIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import MaxAppListbox from "@/components/max-ui/lab/MaxAppListbox";
import PublishedProductCard from "@/components/PublishedProductCard";
import ProductRestrictedLink from "@/components/ProductRestrictedLink";
import SearchResultsFacets from "@/components/SearchResultsFacets";
const sortOptions = [
  { name: "Newest", key: "desc", type: "sort_dir" },
  { name: "Oldest", key: "asc", type: "sort_dir" },
  { name: "Relevance", key: "score", type: "sort_field" },
];
const viewOptions = [
  { name: "List", key: "list" },
  { name: "Grid", key: "grid" },
  //{ label: "Visuals", key: "visuals" },
];
const resultOptions = [
  { name: "5", key: 5 },
  { name: "10", key: 10 },
  { name: "25", key: 25 },
  { name: "50", key: 50 },
];

export default {
  components: {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionChild,
    TransitionRoot,
    CalendarIcon,
    ChevronUpIcon,
    ChevronUpDownIcon,
    XMarkIcon,
    MaxAppListbox,
    PublishedProductCard,
    ProductRestrictedLink,
    SearchResultsFacets,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const loadingResults = computed(() => store.state.search.loading);
    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

    const getSubregionNameForCountryCode = (code) => {
      return criteria.value.subregions.find((subregion) => {
        return subregion.country_codes.find(
          (countryCode) => countryCode === code
        );
      }).name;
    };

    const getHeaderName = (route) => {
      if (
        route.name === "issues" ||
        route.name === "regions" ||
        route.name === "subregions" ||
        route.name === "countries"
      ) {
        return route.params.name ? route.params.name : "Search";
      } else {
        return "Search";
      }
    };
    const getSubheaderName = ({ name, params }) => {
      if (name === "countries") {
        const countryValue = getValueForName(
          criteria.value.countries,
          params.name
        );
        let subregionName = "";
        if (countryValue) {
          subregionName = getSubregionNameForCountryCode(countryValue.code);
        }
        return subregionName;
      } else {
        return "";
      }
    };

    const pageHeader = ref(getHeaderName(route));
    const pageSubheader = ref(getSubheaderName(route));

    const buildDateRange = () => {
      const queryStartDate = route.query["start_date"];
      const queryEndDate = route.query["end_date"];
      if (!queryStartDate && !queryEndDate) {
        return null;
      }
      let dateRange = [null, null];
      if (queryStartDate) {
        dateRange[0] = dayjs(queryStartDate).toDate();
      }
      if (queryEndDate) {
        dateRange[1] = dayjs(queryEndDate).toDate();
      }
      return dateRange;
    };

    const queryDateRange = ref(buildDateRange());

    const handleDateRange = () => {
      let query = {
        ...route.query,
      };
      const startDate = queryDateRange.value[0];
      const endDate = queryDateRange.value[1];
      if (startDate) {
        query["start_date"] = dayjs(startDate).format("YYYY-MM-DD");
      } else {
        delete query["start_date"];
      }
      if (endDate) {
        query["end_date"] = dayjs(endDate).format("YYYY-MM-DD");
      } else {
        delete query["end_date"];
      }
      router.push({
        query,
      });
    };

    const selectDate = (code) => {
      const today = dayjs().toDate();
      let pastDate = dayjs();
      switch (code) {
        case "24H":
          pastDate = pastDate.subtract(1, "day").toDate();
          break;
        case "1WK":
          pastDate = pastDate.subtract(1, "week").toDate();
          break;
        case "1MO":
          pastDate = pastDate.subtract(1, "month").toDate();
          break;
        case "6MO":
          pastDate = pastDate.subtract(6, "month").toDate();
          break;
        case "1YR":
          pastDate = pastDate.subtract(1, "year").toDate();
          break;
      }
      if (queryDateRange.value) {
        queryDateRange.value[0] = pastDate;
        queryDateRange.value[1] = today;
      } else {
        queryDateRange.value = [];
        queryDateRange.value[0] = pastDate;
        queryDateRange.value[1] = today;
      }
    };

    const clearFilters = () => {
      router.push({ name: "search", query: {} });
    };

    /*
      - Takes a list of types (e.g: ['countries[]', 'regions[]']) and a list of list box items
      - 1) Looks in the route query if any of types are present there
      - 2) For each type found in the query, it loops through the values for that query property
      - 3) Each value is then matched up against the list of list box items and pushed into the 'selectedModels' array
      - 4) The selectedModels represents the list of currently selected items in the list box
    */
    const currentModel = ({ items, types }) => {
      //console.log("currentModel: ", items, types);
      const selectedModels = [];
      if (items.length > 0) {
        types.forEach((type) => {
          if (route.query[type]) {
            if (!Array.isArray(route.query[type])) {
              route.query[type] = [route.query[type]];
            }
            for (let i = 0; i < route.query[type].length; i++) {
              selectedModels.push(
                items.find(
                  (item) =>
                    item.code ===
                    (type === "product_types[]"
                      ? parseInt(route.query[type][i])
                      : route.query[type][i])
                )
              );
            }
          }
        });
      }
      if (selectedModels.length > 0) {
        console.log("selectedModels: ", selectedModels);
      }
      return selectedModels;
    };

    const buildItems = (items, type) => {
      return items.map((item) => ({ ...item, type }));
    };
    const buildRegions = () => {
      let items = [];
      criteria.value.regions.forEach((region) => {
        items.push({ ...region, type: "regions[]" });
        if (region.subregions.length > 1) {
          region.subregions.forEach((subregionCode) => {
            const subregion = getValueForCode(
              criteria.value.subregions,
              subregionCode
            );
            items.push({
              ...subregion,
              type: "subregions[]",
              subitem: true,
            });
          });
        }
      });
      criteria.value.countries.forEach((country) => {
        items.push({ ...country, type: "countries[]" });
      });
      return items;
    };
    const buildIssues = () => {
      let items = [];
      criteria.value.issues.forEach((issue) => {
        items.push({ ...issue, type: "issues[]" });
        issue.topics.forEach((topic) => {
          items.push({
            ...topic,
            code: topic.codes[0],
            type: "topics[]",
            subitem: true,
          });
        });
      });
      return items;
    };

    const buildQueryFilters = () => {
      const regions = {
        items: buildRegions(),
        types: ["regions[]", "subregions[]", "countries[]"],
      };
      const issues = {
        items: buildIssues(),
        types: ["issues[]", "topics[]"],
      };
      const reportings = {
        items: buildItems(criteria.value.product_types, "product_types[]"),
        types: ["product_types[]"],
        //types: ["reporting_types[]", "product_types[]"],
      };
      const classifications = {
        items: buildItems(criteria.value.classification, "classification[]"),
        types: ["classification[]"],
      };
      const mediaTypes = {
        items: buildItems(criteria.value.media_tags, "media_tags[]"),
        types: ["media_tags[]"],
      };
      const producingOffices = {
        items: buildItems(
          criteria.value.producing_offices,
          "producing_offices[]"
        ),
        types: ["producing_offices[]"],
      };
      // const nonStateActors = {
      //   items: buildItems(
      //     criteria.value.non_state_actors,
      //     "non_state_actors[]"
      //   ),
      //   types: ["non_state_actors[]"],
      // };
      return {
        regions: {
          label: "Regions & Countries",
          model: currentModel(regions),
          list: regions.items,
          types: regions.types,
          component: "MaxCombobox",
        },
        issues: {
          label: "Counterterrorism & Subtopics",
          model: currentModel(issues),
          list: issues.items,
          types: issues.types,
          component: "MaxListbox",
        },
        reporting: {
          label: "Product Types",
          model: currentModel(reportings),
          list: reportings.items,
          types: reportings.types,
          component: "MaxListbox",
        },
        classifications: {
          label: "Classifications",
          model: currentModel(classifications),
          list: classifications.items,
          types: classifications.types,
          component: "MaxListbox",
        },
        media_types: {
          label: "Media Types",
          model: currentModel(mediaTypes),
          list: mediaTypes.items,
          types: mediaTypes.types,
          component: "MaxListbox",
        },
        // nonstate_actors: {
        //   label: "Non State Actors",
        //   model: currentModel(nonStateActors),
        //   list: nonStateActors.items,
        //   types: nonStateActors.types,
        // },
        producing_offices: {
          label: "Producing Offices",
          model: currentModel(producingOffices),
          list: producingOffices.items,
          types: producingOffices.types,
          component: "MaxListbox",
        },
        // frontpage_featured: {
        //   label: "Front Page Featured",
        //   model: [],
        //   list: [],
        //   types: ["selected_for[]"],
        //   disabled: true,
        // },
      };
    };
    const queryText = ref(
      route.name === "issues" ? route.params.name : route.query.text || ""
    );
    const queryDisabled = ref(route.name === "issues" ? true : false);
    const queryFilters = ref(buildQueryFilters());

    const getBooleanMapping = (queryKey) => {
      if (queryKey === "product_types[]") {
        return false;
      } else {
        const bracketIndex = queryKey.indexOf("[]");
        if (bracketIndex !== -1) {
          return queryKey.slice(0, bracketIndex).concat("_bool");
        }
        return false;
      }
    };

    const getListForType = (type) => {
      switch (type) {
        case "regions[]":
          return criteria.value.regions;
        case "subregions[]":
          return criteria.value.subregions;
        case "countries[]":
          return criteria.value.countries;
        case "issues[]":
          return criteria.value.issues;
        case "topics[]":
          return criteria.value.topics;
        case "reporting_types[]":
          return criteria.value.reporting_types;
        case "product_types[]":
          return criteria.value.product_types;
        case "producing_offices[]":
          return criteria.value.producing_offices;
        case "classification[]":
          return criteria.value.classification;
        case "media_tags[]":
          return criteria.value.media_tags;
        case "non_state_actors[]":
          return criteria.value.non_state_actors;
        case "selected_for[]":
          return criteria.value.selected_for;
        default:
          return [];
      }
    };

    const buildBooleanFilters = () => {
      const filteredKeys = Object.keys(route.query).filter((key) => {
        if (key.indexOf("[]") !== -1) {
          return true;
        }
        return false;
      });
      let queryText, queryDates;
      if (route.query["text"]) {
        queryText = {
          displayName:
            route.name === "issues" ? route.params.name : route.query["text"],
          firstItem: true,
          lastItem: true,
          type: route.name === "issues" ? "query" : "text",
        };
      }
      if (route.query["start_date"] || route.query["end_date"]) {
        let endDate = route.query["end_date"];
        if (!endDate) {
          endDate = "Present";
        }
        queryDates = {
          displayName: route.query["start_date"] + " - " + endDate,
          firstItem: true,
          lastItem: true,
          type: "dates",
        };
      }
      let booleanFilterGroups = [];
      filteredKeys.forEach((type) => {
        const booleanMapping = getBooleanMapping(type);
        const list = getListForType(type);
        let items = !Array.isArray(route.query[type])
          ? [route.query[type]]
          : route.query[type];
        items = items.map((code) => {
          const displayName = getValueForCode(
            list,
            type === "product_types[]" ? parseInt(code) : code
          );
          return {
            code,
            displayName: displayName ? displayName.name : null,
          };
        });
        //console.log("items: ", items);
        let boolean_val = "or";
        let toggleable = false;
        if (booleanMapping) {
          boolean_val = route.query[booleanMapping];
          toggleable = type === "reporting_types[]" ? false : true;
        }
        booleanFilterGroups.push({
          type,
          items,
          boolean_val,
          toggleable,
        });
      });
      //console.log("booleanFilterGroups: ", booleanFilterGroups);
      let booleanFilters = [];
      if (queryText) {
        booleanFilters.push(queryText);
      }
      if (queryDates) {
        booleanFilters.push(queryDates);
      }
      booleanFilterGroups.forEach((filterGroup) => {
        filterGroup.items.forEach((item, index, array) => {
          let booleanFilter = {
            displayName: item.displayName,
            code: item.code,
            type: filterGroup.type,
            boolean_val: filterGroup.boolean_val,
            toggleable: filterGroup.toggleable,
          };
          if (index === 0) {
            booleanFilter.firstItem = true;
          }
          if (index === array.length - 1) {
            booleanFilter.lastItem = true;
          }
          booleanFilters.push(booleanFilter);
        });
      });
      console.log("booleanFilters: ", booleanFilters);
      return booleanFilters;
    };
    const booleanFilters = ref(buildBooleanFilters());
    const showSelectors = ref(true);

    const toggleSelectors = () => {
      showSelectors.value = !showSelectors.value;
    };

    const removeFilter = (item) => {
      let query = {
        ...route.query,
        page: 1,
      };
      if (item.type === "text" || item.type === "query") {
        delete query["text"];
      } else if (item.type === "dates") {
        delete query["start_date"];
        delete query["end_date"];
      } else {
        query[item.type] = query[item.type].filter(
          (queryItem) => queryItem !== item.code
        );
        if (query[item.type].length < 2) {
          const booleanMapping = getBooleanMapping(item.type);
          if (query[booleanMapping]) {
            delete query[booleanMapping];
          }
          if (query[item.type].length === 0) {
            delete query[item.type];
          }
        }
      }
      console.log("route: ", route.query.text);
      router.push({
        name: route.name === "issues" && !query.text ? "search" : route.name,
        query,
      });
    };

    const toggleBooleanValue = (item) => {
      let query = {
        ...route.query,
      };
      const booleanMapping = getBooleanMapping(item.type);
      if (query[booleanMapping] === "and") {
        query[booleanMapping] = "or";
      } else {
        query[booleanMapping] = "and";
      }
      router.push({
        query,
      });
    };

    /*
      - This method builds a watcher for each query filter in order to track changes at the individual listbox level
      - 1) First, a query value is initialized that contains a copy of the existing query.
      - 2) The types present in this query filter are then removed from the newly created query object
      - 3) If the query filter's model values are empty, this skips to step 8
      - 4) The unique types present in the query filter's model are identified
      - 5) Each unique type is matched up against the query filter's model values (selected items) and the query is updated for each type
      - 6) For each unique type, it checks if a boolean mapping exists in the updated query
      - 7a) If it exists and the number of items for the query object is more than 1, it adds/keeps the boolean mapping
      - 7b) If it exists and the number of items for the query object is 1 or less, it removes the boolean mapping
      - 8) The updated query is sent to the router via a router.push and this fires off a query update
    */
    const buildWatcher = (object) => {
      return watch(
        () => object,
        (newValue) => {
          console.log("local watcher triggered.", newValue);
          let query = {
            ...route.query,
            page: 1,
          };
          newValue.types.forEach((type) => {
            delete query[type];
          });
          if (newValue.model.length > 0) {
            const uniqueTypes = [
              ...new Set(newValue.model.map((item) => item.type)),
            ];
            //console.log("uniqueTypes: ", uniqueTypes);
            for (let i = 0; i < uniqueTypes.length; i++) {
              let valuesForType = [];
              for (let j = 0; j < newValue.model.length; j++) {
                //console.log("newValue.model: ", newValue.model);
                if (newValue.model[j].type === uniqueTypes[i]) {
                  valuesForType.push(newValue.model[j].code);
                }
              }
              //console.log("valuesForType after: ", valuesForType);
              query[uniqueTypes[i]] = valuesForType;
            }
            uniqueTypes.forEach((type) => {
              const booleanMapping = getBooleanMapping(type);
              //console.log("booleanMapping: ", booleanMapping);
              if (booleanMapping) {
                const mappingFound = Object.keys(query).find(
                  (queryKey) => queryKey === booleanMapping
                );
                if (!mappingFound && query[type] && query[type].length > 1) {
                  query[booleanMapping] = "and";
                }
                if (mappingFound && query[type].length <= 1) {
                  delete query[booleanMapping];
                }
              }
            });
          }
          router.push({
            name: route.name === "issues" ? "issues" : "search",
            query: query,
          });
        },
        { deep: true }
      );
    };
    const buildQueryWatchers = (object) => {
      let watchers = [];
      Object.keys(object).forEach((filter) => {
        watchers.push(buildWatcher(object[filter]));
      });
      return watchers;
    };

    const getSortOption = (query) => {
      const sortDir = query.sort_dir ? query.sort_dir : undefined;
      const sortField = query.sort_field ? query.sort_field : undefined;
      if (sortDir && !sortField) {
        return sortDir === "asc" ? sortOptions[1] : sortOptions[0];
      }
      if (sortField && !sortDir) {
        if (sortField === "score") {
          return sortOptions[2];
        }
      }
      return sortOptions[0];
    };

    const selectedSort = ref(getSortOption(route.query));
    const selectedView = ref(
      route.query.view === "grid"
        ? viewOptions[1]
        : route.query.view === "visuals"
        ? viewOptions[2]
        : viewOptions[0]
    );
    const getResultCount = (query) => {
      let numResults;
      if (query.per_page) {
        numResults = resultOptions.find(
          (result) => result.key == query.per_page
        );
        return numResults;
      } else {
        numResults = resultOptions[1];
        return numResults;
      }
    };
    const selectedResultCount = ref(getResultCount(route.query));

    const currentPage = ref(parseInt(route.query.page) || 1);

    const getImgUrl = (url) => {
      return require("@/assets/" + url);
    };
    const isMobileFacetsDialogOpen = ref(false);

    onMounted(() => {
      store.dispatch("search/search");
      buildQueryWatchers(queryFilters.value);
    });

    const searchQueryText = () => {
      let query = {
        ...route.query,
        page: 1,
      };
      if (!queryText.value) {
        delete query["text"];
      } else {
        query = { ...query, text: queryText.value };
      }
      router.push({
        name: "search",
        query: query,
      });
    };

    const showHighlightedResult = () => {
      if (route.name === "search" && route.query.text !== "") {
        return true;
      }
      return false;
    };

    const toggleImgContainer = (result, value) => {
      result.hasImage = value;
    };

    watch(
      () => route.query,
      () => {
        console.log(`route.query watcher triggered [${route.name}]`);
        if (
          route.name === "search" ||
          route.name === "issues" ||
          route.name === "regions" ||
          route.name === "subregions" ||
          route.name === "countries"
        ) {
          store.dispatch("search/search");
          pageHeader.value = getHeaderName(route);
          pageSubheader.value = getSubheaderName(route);

          queryText.value =
            route.name === "issues" && route.query.text
              ? route.params.name
              : route.query.text || "";
          queryDisabled.value =
            route.name === "issues" && route.query.text ? true : false;
          queryDateRange.value = buildDateRange();
          queryFilters.value = buildQueryFilters();
          booleanFilters.value = buildBooleanFilters();
          currentPage.value = parseInt(route.query.page) || 1;
          selectedView.value =
            route.query.view === "grid"
              ? viewOptions[1]
              : route.query.view === "visuals"
              ? viewOptions[2]
              : viewOptions[0];
          selectedResultCount.value = route.query.per_page
            ? resultOptions.find((a) => a.key == route.query.per_page)
            : selectedResultCount.value;
        }
      }
    );

    /*
      Metadata needs to load first before building the query filters.
      Countries subheader relies on Metadata so we load that as well.
    */
    watch([loadingMetadata], () => {
      if (!loadingMetadata.value) {
        queryFilters.value = buildQueryFilters();
        booleanFilters.value = buildBooleanFilters();
      }
      if (route.name === "countries") {
        pageSubheader.value = getSubheaderName(route);
      }
    });

    watch(
      () => queryFilters,
      () => {
        buildQueryWatchers(queryFilters.value);
      },
      { deep: true }
    );

    watch([selectedSort], () => {
      let query = { ...route.query, page: currentPage.value };
      if (selectedSort.value.type === "sort_dir") {
        if (query.sort_field) {
          delete query["sort_field"];
        }
        query = { ...query, sort_dir: selectedSort.value.key };
      } else {
        if (query.sort_dir) {
          delete query["sort_dir"];
        }
        query = { ...query, sort_field: selectedSort.value.key };
      }
      router.push({
        query,
      });
      localStorage.setItem("lastSort", selectedSort.value.key);
    });

    watch([selectedView], () => {
      console.log("selectedView watcher triggered.");
      if (
        selectedView.value.key === "list" ||
        selectedView.value.key === "grid"
      ) {
        router.push({
          query: {
            ...route.query,
            view: selectedView.value.key,
          },
        });
      } else if (selectedView.value.key === "visuals") {
        let query = {
          ...route.query,
          view: selectedView.value.key,
        };
        //TODO: Align these values with thats on the backend
        query["media_tags[]"] = [
          "audio",
          "interactive",
          "graphic",
          "map",
          "video",
        ];
        router.push({
          query,
        });
      }
    });

    watch([selectedResultCount], () => {
      console.log("selectedResultCount watcher triggered.");
      router.push({
        query: {
          ...route.query,
          page: 1,
          per_page: selectedResultCount.value.key,
        },
      });
    });

    const closeMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = false);

    const openMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = true);

    const openMedia = (url) => {
      let route = getImgUrl(url);
      window.open(route);
    };

    return {
      dayjs,
      isProductLocked,
      formatDate,
      loadingMetadata,
      loadingResults,
      results,
      totalCount,
      aggregations,
      pageHeader,
      pageSubheader,
      queryDateRange,
      handleDateRange,
      selectDate,
      clearFilters,
      queryText,
      queryDisabled,
      searchQueryText,
      showHighlightedResult,
      toggleImgContainer,
      queryFilters,
      booleanFilters,
      showSelectors,
      toggleSelectors,
      removeFilter,
      toggleBooleanValue,
      sortOptions,
      selectedSort,
      viewOptions,
      selectedView,
      resultOptions,
      selectedResultCount,
      getResultCount,
      currentPage,
      getImgUrl,
      isMobileFacetsDialogOpen,
      closeMobileFacetsDialog,
      openMobileFacetsDialog,
      openMedia,
    };
  },
};
</script>
<style scoped lang="scss"></style>
