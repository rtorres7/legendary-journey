<template>
  <div class="max-w-[475px] sm:max-w-[1600px] w-full p-8">
    <div class="text-2xl text-gray-700">Saved Products</div>
    <div class="py-6 sm:flex justify-between items-center">
      <template v-if="loadingSaved">
        <div
          class="h-6 bg-slate-200 rounded mb-2 w-1/3 lg:1/4 animate-pulse"
        ></div>
      </template>
      <template v-else>
        <div v-if="numProducts > 0" class="font-semibold mb-4 sm:mb-0">
          <template v-if="numProducts == 1">{{ numProducts }} product</template>
          <template v-else>{{ numProducts }} products</template>
        </div>
      </template>
      <div v-if="mySaved.length > 0" class="flex space-x-4">
        <Listbox
          v-model="selectedSort"
          as="div"
          class="min-w-[215px] inline-flex items-center text-gray-700"
        >
          <div>
            <ListboxLabel class="text-sm line-clamp-1 xl:line-clamp-none w-max">
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
          @click="openFacetsDialog"
        >
          <span>Filters</span>
          <AdjustmentsHorizontalIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
    <template v-if="loadingSaved">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      ></div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="card in 6" :key="card">
          <MyPublishedProductCard :loading="true" />
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="mySaved.length == 0">
        <p class="italic">No saved products to show</p>
      </template>
      <template v-else>
        <div class="pb-6">
          <div class="flex flex-row-reverse py-1 mt-2">
            <template v-if="!loadingMetadata && booleanFilters.length > 0">
              <button class="text-blue-700" @click="toggleSelectors">
                {{
                  showSelectors
                    ? "Hide Selectors"
                    : `Show Selectors (${booleanFilters.length})`
                }}
              </button>
            </template>
          </div>
          <!-- Boolean Selectors -->
          <template
            v-if="
              !loadingMetadata && showSelectors && booleanFilters.length > 0
            "
          >
            <div
              class="border border-slate-300/70 shadow-sm rounded mt-2 px-4 py-2 w-fit text-sm"
            >
              <div class="flex flex-wrap">
                <template v-for="(n, index) in booleanFilters" :key="n">
                  <div
                    class="my-2"
                    :class="[
                      n.lastItem && index < booleanFilters.length - 1
                        ? 'pr-3 border-r border-slate-700/50'
                        : 'pr-2',
                      index !== 0 && n.firstItem ? 'pl-3' : '',
                    ]"
                  >
                    <div class="flex rounded-xl bg-slate-100 p-2">
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
                          class="h-5 w-5 text-blue-700"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                  <template v-if="!n.lastItem">
                    <template v-if="n.toggleable">
                      <button
                        class="mr-3 text-blue-700"
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
            </div>
          </template>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <template v-for="product in mySaved" :key="product">
            <MyPublishedProductCard
              :product="product"
              type="saved"
              :productTypeName="getProductTypeName(product)"
              @remove="removeSavedProduct(product)"
            />
          </template>
        </div>
      </template>
    </template>
  </div>
  <BaseDialog
    :isOpen="isFacetsDialogOpen"
    class="max-w-fit"
    @close="closeFacetsDialog"
  >
    <Facets
      :facets="aggregations"
      class="grid grid-cols-2 md:grid-cols-3 gap-4"
    />
  </BaseDialog>
  <Overlay :show="removingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Removing Product...</p>
      <div class="w-fit m-auto">
        <LoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </Overlay>
</template>
<script>
import { computed, onMounted, inject, ref, watch } from "vue";
import axios from "@/shared/config/wireAxios";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import MyPublishedProductCard from "../components/MyPublishedProductCard.vue";
import { productDetails } from "../data";
import { facetAggregations } from "../data";
import Overlay from "../components/Overlay.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import BaseDialog from "../components/BaseDialog.vue";
import Facets from "../components/Facets.vue";
import { getValueForCode } from "@/shared/helpers";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/vue/24/solid";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
export default {
  components: {
    MyPublishedProductCard,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    CheckIcon,
    XMarkIcon,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Overlay,
    LoadingSpinner,
    BaseDialog,
    Facets,
  },
  setup() {
    const environment = ref(import.meta.env.MODE);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const path = computed(() => route.fullPath);
    const metadata = inject("metadata");
    const criteria = computed(() => store.state.metadata.criteria);
    const loadingMetadata = computed(() => store.state.metadata.loading);
    const mySaved = ref([]);
    const loadingSaved = ref(true);
    const numProducts = computed(() => mySaved.value.length);
    const aggregations = ref([]);
    const isFacetsDialogOpen = ref(false);
    const closeFacetsDialog = () => {
      isFacetsDialogOpen.value = false;
    };
    const openFacetsDialog = () => {
      isFacetsDialogOpen.value = true;
    };
    const sortOptions = [
      { name: "Newest", key: "desc", type: "sortDir" },
      { name: "Oldest", key: "asc", type: "sortDir" },
      { name: "Most Views", key: "views", type: "sortDir" },
    ];
    const getSortOption = (query) => {
      const sortDir = query.sortDir ? query.sortDir : undefined;
      if (sortDir) {
        switch (sortDir) {
          case "asc":
            return sortOptions[1];
          case "views":
            return sortOptions[2];
          default:
            return sortOptions[0];
        }
      }
      return sortOptions[0];
    };
    const selectedSort = ref(getSortOption(route.query));
    const createNotification = inject("create-notification");
    const removingProduct = ref(false);
    const removeSavedProduct = (product) => {
      if (import.meta.env.MODE === "offline") {
        createNotification({
          title: "Saved Product Removed",
          message: `Product ${product.productNumber} has been removed from Saved Products.`,
          type: "success",
        });
        let p = mySaved.value.find(
          (item) => item.productNumber == product.productNumber
        );
        let indexOfProduct = mySaved.value.indexOf(p);
        mySaved.value.splice(indexOfProduct, 1);
      } else {
        removingProduct.value = true;
        axios.delete("/workspace/saved/" + product.id).then((response) => {
          if (response.data.error) {
            removingProduct.value = false;
            createNotification({
              title: "Error",
              message: response.data.error,
              type: "error",
              autoClose: false,
            });
          } else {
            removingProduct.value = false;
            createNotification({
              title: "Product Removed",
              message: `Product ${product.productNumber} has been removed from Saved Products.`,
              type: "success",
            });
            let p = mySaved.value.find(
              (item) => item.productNumber == product.productNumber
            );
            let indexOfProduct = mySaved.value.indexOf(p);
            mySaved.value.splice(indexOfProduct, 1);
          }
        });
      }
    };

    const getSavedProducts = (path) => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          let products = [];
          productDetails.forEach((product) => {
            if (product.data.state == "posted") {
              products.push(product.data);
            }
          });
          mySaved.value = products;
          loadingSaved.value = false;
          aggregations.value = facetAggregations;
          console.log("Aggregations: ", facetAggregations);
        }, 1000);
      } else {
        if (route.name == "saved") {
          axios.get(path).then((response) => {
            loadingSaved.value = false;
            if (response.data) {
              mySaved.value = response.data.content;
              aggregations.value = response.data.supplementaryData.aggregations;
            } else {
              createNotification({
                title: "Error",
                message: "There was an error retrieving Saved Products.",
                type: "error",
                autoClose: false,
              });
            }
          });
        }
      }
    };
    const getProductTypeName = (product) => {
      if (product.productType.name) {
        return product.productType.name;
      } else {
        let type = metadata.product_types.find(
          (item) => item.code === product.productType
        );
        return type?.displayName;
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
          displayName: route.query["text"],
          firstItem: true,
          lastItem: true,
          type: "text",
        };
      }
      let booleanFilterGroups = [];
      filteredKeys.forEach((type) => {
        const booleanMapping = getBooleanMapping(type);
        const list = getListForType(type);
        console.log("List: ", list);
        let items = !Array.isArray(route.query[type])
          ? [route.query[type]]
          : route.query[type];
        items = items.map((code) => {
          const displayName = getValueForCode(
            list,
            type === "product_types[]" ? parseInt(code) : code
          );
          console.log("displayName: ", displayName);
          return {
            code,
            displayName: displayName ? displayName.name : null,
          };
        });
        console.log("items: ", items);
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
        const theList = getListForType(query[item.type]);
        query[item.type] = theList.filter(
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
      console.log("route: ", route.query);
      router.push({
        name: "saved",
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

    onMounted(() => {
      getSavedProducts(path.value);
    });

    watch([path], () => {
      getSavedProducts(path.value);
    });

    watch([selectedSort], () => {
      let query = { ...route.query };
      query = { ...query, sortDir: selectedSort.value.key };
      router.push({
        query,
      });
      getSavedProducts(path.value);
    });

    watch(
      () => route.query,
      () => {
        console.log(`route.query watcher triggered [${route.name}]`);
        getSavedProducts(path.value);
        booleanFilters.value = buildBooleanFilters();
        closeFacetsDialog();
      }
    );

    /*
      Metadata needs to load first before building the query filters.
      Countries subheader relies on Metadata so we load that as well.
    */
    watch([loadingMetadata], () => {
      if (!loadingMetadata.value) {
        booleanFilters.value = buildBooleanFilters();
      }
    });

    return {
      environment,
      route,
      path,
      mySaved,
      loadingSaved,
      numProducts,
      aggregations,
      isFacetsDialogOpen,
      closeFacetsDialog,
      openFacetsDialog,
      sortOptions,
      selectedSort,
      removingProduct,
      removeSavedProduct,
      getSavedProducts,
      getProductTypeName,
      buildBooleanFilters,
      booleanFilters,
      showSelectors,
      toggleSelectors,
      removeFilter,
      toggleBooleanValue,
      loadingMetadata,
    };
  },
};
</script>
<style></style>
