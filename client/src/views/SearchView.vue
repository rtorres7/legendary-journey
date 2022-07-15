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
  <!-- Search Form -->
  <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
    <Disclosure v-slot="{ open }">
      <div class="flex flex-col justify-between">
        <div
          class="
            grid-cols-1
            md:grid md:grid-cols-2 md:gap-4
            space-y-3
            md:space-y-0
            lg:flex lg:space-x-6 lg:gap-0
            flex-col
            lg:flex-row
            w-full
          "
        >
          <div class="lg:basis-2/5 lg:max-w-none">
            <label class="text-sm font-semibold line-clamp-1 xl:line-clamp-none"
              >Keyword Search or Filter
            </label>
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
          </div>
          <template
            v-for="n in [
              queryFilters.regions,
              queryFilters.issues,
              queryFilters.reporting,
            ]"
            :key="n"
          >
            <div class="lg:basis-1/5 lg:max-w-none">
              <label>
                <span
                  class="text-sm font-semibold line-clamp-1 xl:line-clamp-none"
                  >{{ n.label }}</span
                >
              </label>
              <SearchFormListbox v-model="n.model" :items="n.list" />
            </div>
          </template>
        </div>
        <DisclosureButton
          class="
            py-3
            lg:py-1
            max-w-fit
            hover:text-black
            dark:hover:text-white
            energy:hover:text-whit
          "
        >
          <span class="text-sm text-mission-light-blue mr-2 inline-block">{{
            open ? "Less" : "More"
          }}</span>
          <ChevronUpIcon
            :class="open ? '' : 'rotate-180 transform'"
            class="text-mission-light-blue h-5 w-5 inline-block"
          />
        </DisclosureButton>
      </div>
      <DisclosurePanel class="my-2">
        <div class="flex flex-col lg:flex-row space-y-3 lg:space-y-0">
          <div class="lg:basis-2/5 flex space-x-4 lg:max-w-none lg:pr-6">
            <template
              v-for="n in [
                queryFilters.classifications,
                queryFilters.media_types,
              ]"
              :key="n"
            >
              <div class="basis-1/2">
                <label class="text-sm font-semibold">{{ n.label }}</label>
                <SearchFormListbox v-model="n.model" :items="n.list" />
              </div>
            </template>
          </div>
          <div
            class="
              grid grid-cols-2
              md:grid-cols-3
              gap-4
              lg:gap-0
              lg:grid-cols-0
              lg:flex
              lg:basis-3/5
              lg:space-x-6
              lg:max-w-none
            "
          >
            <template
              v-for="n in [
                queryFilters.nonstate_actors,
                queryFilters.producing_offices,
                queryFilters.frontpage_featured,
              ]"
              :key="n"
            >
              <div class="lg:basis-1/3 lg:max-w-none">
                <label class="text-sm font-semibold">{{ n.label }}</label>
                <SearchFormListbox v-model="n.model" :items="n.list" />
              </div>
            </template>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
  <!-- Search Results & Pagination -->
  <div class="py-4">
    <p class="text-center text-sm py-2">
      {{ totalCount?.toLocaleString() }} Results
    </p>
    <div class="flex flex-col-reverse lg:flex-row py-2">
      <div class="basis-3/4 bg-white rounded-lg shadow-md">
        <template v-for="result in results" :key="result">
          <!-- Search Card -->
          <div
            class="
              flex
              p-4
              border-b border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
            "
          >
            <div
              class="
                h-fit
                px-2
                border-l-2 border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25
                text-center
              "
            >
              <span class="block font-semibold">{{
                dayjs(result.date_published).format("DD")
              }}</span>
              <span class="block text-sm">{{
                dayjs(result.date_published).format("MMM")
              }}</span>
              <span class="block text-sm">{{
                dayjs(result.date_published).format("YYYY")
              }}</span>
            </div>
            <div class="px-2">
              <div class="flex justify-between">
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
                      energy:text-gray-300
                    "
                    >{{ `${"(" + result.title_classification + ") "}` }}</span
                  >
                  <span class="text-black dark:text-white energy:text-white">{{
                    result.title
                  }}</span>
                </div>
                <div class="text-xs lg:text-sm">
                  {{ result.doc_num }}
                </div>
              </div>
              <div
                class="
                  py-2
                  text-sm text-slate-600
                  dark:text-slate-300
                  energy:text-gray-300
                "
              >
                <span v-html="result.highlighted_result" />
              </div>
            </div>
          </div>
        </template>
        <div class="px-4 py-3 flex items-center border-t border-gray-200">
          <div class="flex-1 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">1</span>
                to
                <span class="font-medium">50</span>
                of
                <span class="font-medium">51</span>
                results
              </p>
            </div>
            <div>
              <nav
                class="
                  relative
                  z-0
                  inline-flex
                  rounded-md
                  shadow-sm
                  -space-x-px
                "
                aria-label="Pagination"
              >
                <a
                  href="#"
                  class="
                    relative
                    inline-flex
                    items-center
                    px-2
                    py-2
                    rounded-l-md
                    border border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-500
                    hover:bg-gray-50
                  "
                >
                  <span class="sr-only">Previous</span>
                  <!-- Heroicon name: solid/chevron-left -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                <a
                  href="#"
                  aria-current="page"
                  class="
                    z-10
                    bg-slate-50
                    border-black
                    text-black
                    relative
                    inline-flex
                    items-center
                    px-4
                    py-2
                    border
                    text-sm
                    font-medium
                  "
                >
                  1
                </a>
                <span
                  class="
                    relative
                    inline-flex
                    items-center
                    px-4
                    py-2
                    border border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  ...
                </span>
                <a
                  href="#"
                  class="
                    bg-white
                    border-gray-300
                    text-gray-500
                    hover:bg-gray-50
                    hidden
                    md:inline-flex
                    relative
                    items-center
                    px-4
                    py-2
                    border
                    text-sm
                    font-medium
                  "
                >
                  2
                </a>
                <a
                  href="#"
                  class="
                    relative
                    inline-flex
                    items-center
                    px-2
                    py-2
                    rounded-r-md
                    border border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-500
                    hover:bg-gray-50
                  "
                >
                  <span class="sr-only">Next</span>
                  <!-- Heroicon name: solid/chevron-right -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          basis-1/4
          grid grid-cols-3
          gap-4
          lg:gap-0 lg:grid-cols-none lg:flex lg:flex-col
          h-full
          lg:ml-4
          mb-4
          lg:mb-0
          p-4
          bg-white
          rounded-lg
          shadow-md
        "
      >
        <template
          v-for="({ displayName, rows, expand }, index) in aggregations"
          :key="index"
        >
          <div class="py-2">
            <p class="text-sm font-semibold">{{ displayName }}</p>
            <div class="flex flex-col">
              <template v-for="(facet, index) in rows" :key="facet">
                <div :class="index > 4 && !expand ? 'hidden' : 'block'">
                  <span class="cursor-pointer text-sm text-mission-light-blue"
                    >{{ facet.name }}
                  </span>
                  <span class="text-sm"> ({{ facet.count }}) </span>
                </div>
              </template>
              <template v-if="rows.length > 5">
                <span
                  @click="toggleExpand(index)"
                  class="
                    max-w-fit
                    ml-2
                    mt-2
                    cursor-pointer
                    text-sm text-mission-light-blue
                  "
                >
                  <template v-if="expand"> Show Less... </template>
                  <template v-else> Show More... </template>
                </span>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/outline";
import SearchFormListbox from "@/components/SearchFormListbox";

const testItems = [
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
    ChevronUpIcon,
    SearchFormListbox,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

    const queryFilters = ref({
      regions: {
        label: "Regions & Countries",
        model: "",
        list: testItems,
      },
      issues: {
        label: "Issues & Topics",
        model: "",
        list: testItems,
      },
      reporting: {
        label: "Reporting & Product Types",
        model: "",
        list: testItems,
      },
      classifications: {
        label: "Classifications",
        model: "",
        list: testItems,
      },
      media_types: {
        label: "Media Types",
        model: "",
        list: testItems,
      },
      nonstate_actors: {
        label: "Non State Actors",
        model: "",
        list: testItems,
      },
      producing_offices: {
        label: "Producing Offices",
        model: "",
        list: testItems,
      },
      frontpage_featured: {
        label: "Front Page Featured",
        model: "",
        list: testItems,
      },
    });

    const testModel = ref("");
    const anotherTest = ref("");

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch(
      () => route.query,
      () => {
        store.dispatch("search/search");
      }
    );

    const toggleExpand = (key) => {
      aggregations.value[key].expand = !aggregations.value[key].expand;
    };

    return {
      dayjs,
      queryFilters,
      testModel,
      anotherTest,
      testItems,
      results,
      totalCount,
      aggregations,
      toggleExpand,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
