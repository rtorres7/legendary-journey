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
  <div class="py-4">
    <!-- Search Results & Pagination Container -->
    <template v-if="loading"> Loading...</template>
    <template v-if="!loading && totalCount > 0">
      <p class="text-center text-sm py-2">
        {{ totalCount?.toLocaleString() }} Results
      </p>
      <div class="flex flex-col-reverse lg:flex-row py-2">
        <div class="basis-3/4 h-fit bg-white rounded-lg shadow-md">
          <!-- Results -->
          <template v-for="result in results" :key="result">
            <div
              class="
                flex
                p-4
                border-b border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25
              "
            >
              <div class="h-fit px-2 text-center">
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
                    <span
                      class="text-black dark:text-white energy:text-white"
                      >{{ result.title }}</span
                    >
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
          <!-- Pagination -->
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
                    <ChevronLeftIcon class="h-5 w-5" />
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
                    <ChevronRightIcon class="h-5 w-5" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <!-- Results Facets -->
        <div
          class="
            hidden
            lg:block
            basis-1/4
            bg-white
            rounded-lg
            shadow-md
            ml-4
            h-full
          "
        >
          <SearchResultsFacets :facets="aggregations" />
        </div>
        <div
          class="
            lg:hidden
            block
            cursor-pointer
            text-sm text-mission-light-blue
            py-4
          "
          @click="openMobileFacetsDialog"
        >
          Show Filters
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
                  <DialogOverlay class="fixed inset-0 bg-black opacity-50" />
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
                  <div
                    class="
                      inline-block
                      w-full
                      max-w-xl
                      md:max-w-[700px]
                      lg:max-w-[900px]
                      p-6
                      my-8
                      text-left
                      align-middle
                      transition-all
                      transform
                      text-slate-700
                      dark:text-slate-300
                      energy:text-gray-300
                      bg-slate-100
                      dark:bg-slate-700
                      energy:bg-gray-700
                      shadow-lg
                      rounded-lg
                    "
                  >
                    <div class="mt-6">
                      <button
                        type="button"
                        class="
                          absolute
                          top-5
                          right-5
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                        "
                        tabindex="0"
                        @click="closeMobileFacetsDialog"
                      >
                        <span class="sr-only">Close navigation</span
                        ><XIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                      <SearchResultsFacets
                        :facets="aggregations"
                        class="grid grid-cols-2 md:grid-cols-3 gap-4"
                      />
                    </div>
                  </div>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
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
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogOverlay,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronUpIcon, XIcon } from "@heroicons/vue/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";
import SearchFormListbox from "@/components/SearchFormListbox";
import SearchResultsFacets from "@/components/SearchResultsFacets";

const testItems = [
  "test item 1",
  "test item 2",
  "test item 3",
  "test item 4",
  "test item 5",
];

export default {
  components: {
    Dialog,
    DialogOverlay,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionChild,
    TransitionRoot,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    XIcon,
    SearchFormListbox,
    SearchResultsFacets,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    console.log("route query: ", route.query);

    const loading = computed(() => store.state.search.loading);
    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

    const isMobileFacetsDialogOpen = ref(false);

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

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch(
      () => route.query,
      () => {
        store.dispatch("search/search");
      }
    );

    const closeMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = false);

    const openMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = true);

    return {
      dayjs,
      queryFilters,
      testItems,
      loading,
      results,
      totalCount,
      aggregations,
      isMobileFacetsDialogOpen,
      closeMobileFacetsDialog,
      openMobileFacetsDialog,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
