<template>
  <template v-if="loadingProduct">
    <div class="max-w-fit m-auto mt-[24vh]">
      <MaxLoadingSpinner class="h-28 w-28" />
    </div>
  </template>
  <template v-else>
    <template v-if="!canAccessProduct">
      <NotAuthorized :product="product" />
    </template>
    <template v-else>
      <div v-if="!loadingFeaturedContent && navigation">
        <ProductNavigation :navigation="navigation" />
      </div>
      <div
        class="flex flex-wrap flex-col lg:flex-row lg:flex-nowrap justify-between mb-8"
      >
        <div
          v-if="product.state !== 'draft'"
          class="no-print flex lg:flex-col gap-y-4 gap-x-4 mb-4 pr-0 lg:pr-4"
        >
          <div class="flex">
            <button
              aria-label="print this product"
              @click="printDocument"
              @keyup.enter="printDocument"
            >
              <tippy content="Print this Product">
                <PrinterIcon
                  class="h-6 w-6 cursor-pointer"
                  aria-hidden="true"
                />
              </tippy>
            </button>
            <div
              class="bg-slate-200 dark:bg-slate-800 energy:bg-zinc-800 rounded-full w-fit h-full -mt-2 text-center text-sm p-1"
            >
              <p>
                {{ product.print_count }}
              </p>
            </div>
          </div>
          <div class="flex">
            <a
              :href="`mailto:?subject=Check%20out%20this%20Current...&amp;body=${url}`"
            >
              <tippy content="Email a link to this Product">
                <EnvelopeIcon
                  class="h-6 w-6 cursor-pointer"
                  aria-hidden="true"
                  @click="updateEmailCount"
                />
              </tippy>
            </a>
            <div
              class="bg-slate-200 dark:bg-slate-800 energy:bg-zinc-800 rounded-full w-fit h-full -mt-2 text-center text-sm p-1"
            >
              <p>
                {{ product.email_count }}
              </p>
            </div>
          </div>
          <div>
            <button
              aria-label="copy URL to clipboard"
              @click="copyUrl"
              @keyup.enter="copyUrl"
            >
              <tippy content="Copy URL to Clipboard">
                <LinkIcon class="h-6 w-6 cursor-pointer" aria-hidden="true" />
              </tippy>
            </button>
          </div>
          <div>
            <button
              :aria-label="`save product ${product.productNumber}`"
              @click.prevent="save(product)"
            >
              <template v-if="isSavedProduct(product)">
                <tippy content="Saved">
                  <BookmarkIconSolid aria-hidden="true" class="h-6 w-6" />
                </tippy>
              </template>
              <template v-else>
                <tippy content="Save this product">
                  <BookmarkIcon aria-hidden="true" class="h-6 w-6" />
                </tippy>
              </template>
            </button>
          </div>
          <MaxOverlay :show="savingProduct || removingProduct">
            <div class="max-w-xs inline-block">
              <p v-if="savingProduct" class="mb-4 font-semibold text-2xl">
                Saving Product...
              </p>
              <p v-if="removingProduct" class="mb-4 font-semibold text-2xl">
                Removing Product...
              </p>
              <div class="w-fit m-auto">
                <MaxLoadingSpinner class="h-16 w-16" />
              </div>
            </div>
          </MaxOverlay>
          <div
            v-show="
              canManageWire &&
              canEditProduct(product.product_type_id) &&
              !product?.legacy
            "
          >
            <router-link
              :to="{
                name: 'edit',
                params: {
                  date: product?.feature_date,
                  id: product.feature_id ? product.feature_id : -1,
                  doc_num: product?.doc_num,
                },
              }"
            >
              <tippy content="Edit this Product">
                <PencilIcon class="h-6 w-6 cursor-pointer" aria-hidden="true" />
              </tippy>
            </router-link>
          </div>
        </div>
        <div class="w-full pb-6 lg:pb-0">
          <ProductContent :product="product" />
        </div>
        <div
          class="no-print md:min-w-[440px] pl-0 lg:pl-8 flex flex-col pt-6 lg:pt-0 space-y-3 border-t-2 lg:border-t-0 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
        >
          <ProductAttachments :article="product" />
          <div class="flex flex-col space-y-2">
            <div v-if="product.nonStateActors.length > 0">
              <p class="font-semibold text-lg">Non State Actors</p>
              <ul class="list-disc list-inside">
                <template
                  v-for="(item, index) in product.nonStateActors"
                  :key="item"
                >
                  <li v-if="index <= 4 || (index > 4 && expandNsa)">
                    <router-link
                      :id="getCode(item)"
                      class="hover:underline"
                      :to="'/search?text=&non_state_actors[]=' + getCode(item)"
                      target="_blank"
                      >{{ item.name }}</router-link
                    >
                  </li>
                </template>
              </ul>
              <template v-if="product.nonStateActors.length > 5">
                <button
                  class="max-w-fit ml-2 mt-2 cursor-pointer text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                  @click="
                    toggleExpand('nsa', getCode(product.nonStateActors[4]))
                  "
                >
                  <template v-if="expandNsa"> Show Less... </template>
                  <template v-else> Show More... </template>
                </button>
              </template>
            </div>
            <div v-if="product.topics.length > 0">
              <p class="font-semibold text-lg">Topics</p>
              <ul class="list-disc list-inside">
                <template v-for="(item, index) in product.topics" :key="item">
                  <li v-if="index <= 4 || (index > 4 && expandTopics)">
                    <router-link
                      :id="item.code"
                      class="hover:underline"
                      :to="'/search?text=&topics[]=' + item.code"
                      target="_blank"
                      >{{ getName("topics", item) }}</router-link
                    >
                  </li>
                </template>
              </ul>
              <template v-if="product.topics.length > 5">
                <button
                  class="max-w-fit ml-2 mt-2 cursor-pointer text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                  @click="toggleExpand('topics', product.topics[4].code)"
                >
                  <template v-if="expandTopics"> Show Less... </template>
                  <template v-else> Show More... </template>
                </button>
              </template>
            </div>
            <div v-if="product.countries.length > 0">
              <p class="font-semibold text-lg">Countries</p>
              <ul class="list-disc list-inside">
                <template
                  v-for="(item, index) in product.countries"
                  :key="item"
                >
                  <li v-if="index <= 4 || (index > 4 && expandCountries)">
                    <router-link
                      :id="item.code"
                      class="hover:underline"
                      :to="'/search?text=&countries[]=' + item.code"
                      target="_blank"
                      >{{ getName("countries", item) }}</router-link
                    >
                  </li>
                </template>
              </ul>
              <template v-if="product.countries.length > 5">
                <button
                  class="max-w-fit ml-2 mt-2 cursor-pointer text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                  @click="toggleExpand('countries', product.countries[4].code)"
                >
                  <template v-if="expandCountries"> Show Less... </template>
                  <template v-else> Show More... </template>
                </button>
              </template>
            </div>
          </div>
          <!-- TODO: Use metadata featuresAvailable.relatedDocs for condition -->
          <template v-if="product.state !== 'draft'">
            <template v-if="!loadingRelatedProducts">
              <ProductRelated :relatedProducts="relatedProducts" />
            </template>
          </template>
          <!-- TODO: Use metadata featuresAvailable.metrics for condition -->
          <template v-if="product.state !== 'draft'">
            <template v-if="!loadingMetrics">
              <div class="flex flex-col space-y-4">
                <p class="font-semibold text-lg">Metrics</p>
                <template v-if="metrics.uniqueReaders !== 0">
                  <p>Unique Readers ({{ metrics.uniqueReaders }})</p>
                  <div class="flex items-center">
                    <div class="flex flex-col">
                      <label class="text-sm font-medium mb-1"
                        >Start Date
                        <MaxDatepicker
                          v-model="metricStartDate"
                          :minDate="product.display_date"
                          :maxDate="new Date()"
                          :enableTimePicker="false"
                          format="dd MMMM yyyy"
                          week-start="0"
                          auto-apply
                        />
                      </label>
                    </div>
                    <p class="px-3 pt-4">to</p>
                    <div class="flex flex-col">
                      <label class="text-sm font-medium mb-1"
                        >End Date
                        <MaxDatepicker
                          v-model="metricEndDate"
                          :minDate="product.display_date"
                          :maxDate="new Date()"
                          :enableTimePicker="false"
                          format="dd MMMM yyyy"
                          week-start="0"
                          auto-apply
                        />
                      </label>
                    </div>
                  </div>
                  <ProductMetrics :metrics="metrics.readership" />
                </template>
              </div>
            </template>
            <template v-else>
              <div class="m-auto pt-8">
                <MaxLoadingSpinner class="h-20 w-20" />
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </template>
</template>

<script>
import dayjs from "dayjs/esm/index.js";
import {
  formatDate,
  hasProductAccess,
  isSavedProduct,
  getValueForCode,
  getValueForName,
} from "@/shared/helpers";
import { onMounted, computed, inject, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  PrinterIcon,
  LinkIcon,
  EnvelopeIcon,
  PencilIcon,
  BookmarkIcon,
} from "@heroicons/vue/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/24/solid";
import NotAuthorized from "@current/components/NotAuthorized.vue";
import ProductNavigation from "@current/components/ProductNavigation.vue";
import ProductContent from "@current/components/ProductContent.vue";
import ProductAttachments from "@current/components/ProductAttachments.vue";
import ProductRelated from "@current/components/ProductRelated.vue";
import ProductMetrics from "@current/components/ProductMetrics.vue";
import { productDetails } from "@current/data";
import updateSavedStatus from "@current/composables/updateSavedStatus";
import axios from "@/shared/config/wireAxios";

export default {
  components: {
    PrinterIcon,
    LinkIcon,
    EnvelopeIcon,
    PencilIcon,
    BookmarkIcon,
    BookmarkIconSolid,
    NotAuthorized,
    ProductNavigation,
    ProductContent,
    ProductAttachments,
    ProductRelated,
    ProductMetrics,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const environment = ref(import.meta.env.MODE);
    const url = computed(() => window.location);
    const createSimpleNotification = inject("create-simple-notification");
    const product = computed(() => store.state.product.document);
    const organization = computed(() => store.getters["user/organization"]);
    const loadingProduct = computed(() => store.state.product.loading);
    const featuredArticles = computed(() => store.state.features.features);
    const loadingFeaturedContent = computed(() => store.state.features.loading);
    const { save, savingProduct, removingProduct } = updateSavedStatus();
    const relatedProducts = computed(
      () => store.state.relatedProducts.relatedDocuments
    );
    const loadingRelatedProducts = computed(
      () => store.state.relatedProducts.loading
    );
    const metrics = computed(() => store.state.metrics);
    const loadingMetrics = computed(() => store.state.metrics.loading);
    const metricStartDate = ref(null);
    const metricEndDate = ref(null);
    const navigation = ref(null);
    const printCount = computed(() => store.state.product.document.print_count);
    const emailCount = computed(() => store.state.product.document.email_count);
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const productIsFavorite = ref(store.state.product.document.favorite);
    const offlineMode = import.meta.env.MODE === "offline";
    const criteria = computed(() => store.state.metadata.criteria);

    const printDocument = () => {
      const pdfs = product.value.attachments_metadata.filter(
        (attachment) =>
          attachment.pdf_version === true && attachment.visible === true
      );
      if (pdfs.length === 0) {
        window.print();
      } else {
        const pdfLink =
          window.location.origin +
          "/documents/" +
          product.value.doc_num +
          "/attachments/" +
          pdfs[0].file_name;
        window.open(pdfLink);
      }
      updatePrintCount();
    };
    const updatePrintCount = () => {
      store.dispatch("product/savePrintCount");
    };
    const updateEmailCount = () => {
      store.dispatch("product/saveEmailCount");
    };
    const copyUrl = () => {
      navigator.clipboard.writeText(url.value);
      createSimpleNotification({
        message: "URL Copied to Clipboard",
      });
    };
    const getCode = (item) => {
      //temporary until high side json structure matches low side for countries/topics/non state actors
      const result = getValueForName(
        criteria.value.non_state_actors,
        item.name
      );
      return result.code;
    };
    const getName = (type, item) => {
      //temporary until high side json structure matches low side for countries/topics/non state actors
      if (type == "countries") {
        const result = getValueForCode(criteria.value.countries, item.code);
        return result.name;
      } else if (type == "topics") {
        const result = getValueForCode(criteria.value.topics, item.code);
        return result.name;
      }
    };
    const expandNsa = ref(false);
    const expandTopics = ref(false);
    const expandCountries = ref(false);
    const toggleExpand = (type, code) => {
      switch (type) {
        case "nsa":
          expandNsa.value = !expandNsa.value;
          if (expandNsa.value) {
            document.getElementById(code).focus();
          }
          break;
        case "topics":
          expandTopics.value = !expandTopics.value;
          if (expandTopics.value) {
            document.getElementById(code).focus();
          }
          break;
        case "countries":
          expandCountries.value = !expandCountries.value;
          if (expandCountries.value) {
            document.getElementById(code).focus();
          }
          break;
      }
    };
    const canManageWire = computed(() => store.getters["user/canManageWire"]);

    const theme = computed(() => store.getters["localStorage/theme"]);

    onMounted(() => {
      store.dispatch("product/getProductDetails");
    });

    watch([loadingProduct], () => {
      if (!loadingProduct.value && canAccessProduct.value) {
        store.dispatch("features/loadFeaturedContent");
        document.title = product.value.title;
        if (product.value.state === "posted") {
          store.dispatch("relatedProducts/getRelatedDocuments");
          metricStartDate.value = dayjs(product.value.display_date).toDate();
          metricEndDate.value = dayjs().toDate();
        }
      }
    });

    watch([metricStartDate, metricEndDate], () => {
      if (metricStartDate.value && metricEndDate.value) {
        store.dispatch("metrics/getMetrics", {
          start: formatDate(metricStartDate.value),
          end: formatDate(metricEndDate.value),
        });
      }
    });

    watch([theme], () => {
      store.dispatch("metrics/getMetrics", {
        start: formatDate(metricStartDate.value),
        end: formatDate(metricEndDate.value),
      });
    });

    const buildNavigation = () => {
      const matchIndex = featuredArticles.value.findIndex((featuredArticle) => {
        if (route.params.doc_num === featuredArticle.doc_num) {
          return true;
        }
      });
      if (matchIndex !== -1) {
        navigation.value = {
          currentArticle: {
            position: matchIndex + 1,
          },
          totalArticles: featuredArticles.value.length,
        };
        const prevArticleDocNum =
          matchIndex === 0
            ? null
            : featuredArticles.value[matchIndex - 1].doc_num;
        const nextArticleDocNum =
          matchIndex === featuredArticles.value.length - 1
            ? null
            : featuredArticles.value[matchIndex + 1].doc_num;
        if (prevArticleDocNum) {
          navigation.value["previousArticle"] = {
            doc_num: prevArticleDocNum,
          };
        }
        if (nextArticleDocNum) {
          navigation.value["nextArticle"] = {
            doc_num: nextArticleDocNum,
          };
        }
      }
    };

    const canAccessProduct = computed(() => {
      if (hasProductAccess(product.value, organization.value)) {
        return true;
      }
      return false;
    });

    const canEditProduct = (product_id) => {
      if (!isCommunityExclusive.value) {
        return true;
      } else {
        if (product_id === 10378) {
          return true;
        }
        return false;
      }
    };

    watch([loadingFeaturedContent], () => {
      if (!loadingFeaturedContent.value) {
        buildNavigation();
      }
    });

    watch(
      () => route.params,
      () => {
        if (route.name === "product") {
          store.dispatch("product/getProductDetails");
        }
      }
    );

    watch(productIsFavorite, () => {
      updateFavoriteStatus();
    });

    const updateFavoriteStatus = () => {
      if (import.meta.env.MODE === "offline") {
        let documentMatch = productDetails.find(
          ({ data }) => data.doc_num === product.value.doc_num
        );
        documentMatch.data.favorite = productIsFavorite.value;
        product.value.favorite = productIsFavorite.value;
      } else {
        let favoritePromise;
        if (productIsFavorite.value) {
          favoritePromise = axios.delete(
            `/document_favorites/${product.value.id}`
          );
        } else {
          favoritePromise = axios.post("document_favorites", {
            id: product.value.id,
          });
        }

        favoritePromise.then(
          () => (product.value.favorite = productIsFavorite.value)
        );
      }
    };

    return {
      formatDate,
      hasProductAccess,
      product,
      organization,
      loadingProduct,
      loadingFeaturedContent,
      relatedProducts,
      loadingRelatedProducts,
      metrics,
      loadingMetrics,
      metricStartDate,
      metricEndDate,
      navigation,
      printCount,
      emailCount,
      printDocument,
      updatePrintCount,
      updateEmailCount,
      copyUrl,
      expandNsa,
      expandTopics,
      expandCountries,
      toggleExpand,
      canManageWire,
      url,
      canAccessProduct,
      canEditProduct,
      theme,
      productIsFavorite,
      offlineMode,
      isSavedProduct,
      save,
      savingProduct,
      removingProduct,
      environment,
      getValueForCode,
      getValueForName,
      getCode,
      getName,
    };
  },
};
</script>
