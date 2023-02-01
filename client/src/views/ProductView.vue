<template>
  <template v-if="loadingArticle">
    <div class="max-w-fit m-auto mt-[24vh]">
      <BaseLoadingSpinner class="h-28 w-28" />
    </div>
  </template>
  <template v-else>
    <div v-if="!loadingFeaturedArticles && navigation && !wantsPreview">
      <ProductNavigation :navigation="navigation" />
    </div>
    <div v-show="wantsPreview" class="text-center pb-8 text-sm">
      <div>PREVIEW</div>
      <div>
        If you do not see changes in your document, please save the document and
        select preview again
      </div>
    </div>
    <div
      class="flex flex-wrap flex-col lg:flex-row lg:flex-nowrap justify-between mb-8"
    >
      <div
        v-if="!isDraft && !wantsPreview"
        class="no-print flex lg:flex-col gap-y-4 gap-x-4 mb-4 pr-0 lg:pr-4"
      >
        <div class="flex">
          <a
            :href="`mailto:?subject=Check%20out%20this%20Current...&amp;body=${url}`"
          >
            <EnvelopeIcon
              class="h-6 w-6 cursor-pointer"
              aria-hidden="true"
              @click="updateEmailCount"
            />
          </a>
          <div
            class="bg-slate-200 dark:bg-slate-800 energy:bg-zinc-800 rounded-full w-fit h-full -mt-2 text-center text-sm p-1"
          >
            <p>
              {{ article.email_count }}
            </p>
          </div>
        </div>
        <div>
          <LinkIcon
            class="h-6 w-6 cursor-pointer"
            aria-hidden="true"
            @click="copyUrl"
          />
        </div>
        <div
          v-show="
            canManageWire &&
            canEditProduct(article.product_type_id) &&
            !article?.legacy
          "
        >
          <router-link
            :to="{
              name: 'edit',
              params: {
                date: article?.created_on,
                id: article?.feature_id ? article.feature_id : -1,
                doc_num: article?.doc_num,
              },
            }"
          >
            <PencilIcon class="h-6 w-6 cursor-pointer" aria-hidden="true" />
          </router-link>
        </div>
      </div>
      <div class="w-full flex flex-col space-y-4 pb-6 lg:pb-0">
        <div
          v-if="article.classification !== 'INVALID'"
          class="text-center pb-2 text-sm lg:text-md"
        >
          {{ article.classification }}
        </div>
        <p class="font-semibold text-sm lg:text-md uppercase">product</p>
        <h1 class="font-semibold text-2xl lg:text-3xl">
          <span v-if="article.title_classif !== 'X'">
            ({{ article.title_classif }})
          </span>
          <span>
            {{ article.title }}
          </span>
        </h1>
        <div class="flex space-x-4 text-sm md:text-md">
          <p class="capitalize">
            {{ `${article.state} -` }}
            {{ formatDate(article.date_published) }}
          </p>
          <p aria-hidden="true">●</p>
          <p v-if="article.authors?.length > 0">
            <template v-for="(author, index) in article.authors" :key="index">
              {{ author.name
              }}<span
                v-if="
                  article.authors?.length > 1 &&
                  index < article.authors?.length - 1
                "
                >,
              </span>
            </template>
          </p>
        </div>
        <div class="w-full pr-2">
          <!-- <img
            v-if="article.product_image"
            :src="`/documents/${article.doc_num}/images/article?updated_at=${article.updated_at}`"
            class="h-[350px] w-[350px] float-right"
          /> -->
          <p v-if="article.html_body" class="whitespace-pre-line">
            <span class="ck-content summary" v-html="article.html_body" />
          </p>
        </div>
        <p
          class="font-semibold border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25 pt-4"
        >
          Document Details
        </p>
        <Disclosure v-slot="{ open }">
          <DisclosureButton class="flex space-x-2 text-sm">
            <span>CONTENTS</span>
            <ChevronDownIcon
              class="h-4 w-4"
              :class="open ? 'transform rotate-180' : ''"
            />
          </DisclosureButton>
          <DisclosurePanel>
            <div class="ml-4 space-y-2 text-sm">
              <p>
                <span class="font-semibold">Produced By: </span
                >{{ article.producing_office }}
              </p>
              <p>
                <span class="font-semibold">Product Type: </span
                >{{ article.product_type_name }}
              </p>
              <p>
                <span class="font-semibold">Document Number: </span
                >{{ article.doc_num }}
              </p>
              <p>
                <span class="font-semibold">Posted: </span>
                <template v-if="article.posted_at">
                  {{ formatDate(article.posted_at) }}
                </template>
                <template v-else>
                  {{ formatDate(article.posted_on) }}
                </template>
              </p>
              <p>
                <span class="font-semibold">Publication Date: </span
                >{{ formatDate(article.date_published) }}
              </p>
              <p>
                <span class="font-semibold">Contact: </span
                >{{ article.poc_info }}
              </p>
            </div>
          </DisclosurePanel>
        </Disclosure>
        <!-- <Disclosure v-slot="{ open }">
          <DisclosureButton class="flex space-x-2 text-sm">
            <span>SOURCES</span>
            <ChevronDownIcon
              class="h-4 w-4"
              :class="open ? 'transform rotate-180' : ''"
            />
          </DisclosureButton>
          <DisclosurePanel>
            <ol class="list-decimal list-inside ml-4 space-y-2">
              <div v-for="source in article.sources" :key="source">
                <li class="text-sm">
                  <router-link to="#" class="hover:underline">
                    {{ source }}
                  </router-link>
                </li>
              </div>
            </ol>
          </DisclosurePanel>
        </Disclosure> -->
        <div
          v-if="article.classification !== 'INVALID'"
          class="text-center pb-2 text-sm lg:text-md"
        >
          {{ article.classification }}
        </div>
      </div>
      <div
        class="no-print md:min-w-[480px] pl-0 lg:pl-8 flex flex-col pt-6 lg:pt-0 space-y-3 border-t-2 lg:border-t-0 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
      >
        <ProductAttachments :article="article" />
        <!-- TODO: Use metadata featuresAvailable.relatedDocs for condition -->
        <template v-if="!isDraft && !wantsPreview">
          <template v-if="!loadingRelatedProducts">
            <ProductRelated :relatedProducts="relatedProducts" />
          </template>
        </template>
        <!-- TODO: Use metadata featuresAvailable.metrics for condition -->
        <template v-if="!isDraft && !wantsPreview">
          <template v-if="!loadingMetrics">
            <div class="flex flex-col space-y-4">
              <p class="font-semibold text-lg">Metrics</p>
              <template v-if="metrics.uniqueReaders !== 0">
                <p>Unique Readers ({{ metrics.uniqueReaders }})</p>
                <div class="flex items-center">
                  <div class="flex flex-col">
                    <label class="text-sm font-medium mb-1">Start Date</label>
                    <BaseDatepicker
                      v-model="metricStartDate"
                      :minDate="article.display_date"
                      :maxDate="new Date()"
                      :enableTimePicker="false"
                      format="dd MMMM yyyy"
                      week-start="0"
                      auto-apply
                    />
                  </div>
                  <p class="px-3 pt-4">to</p>
                  <div class="flex flex-col">
                    <label class="text-sm font-medium mb-1">End Date</label>
                    <BaseDatepicker
                      v-model="metricEndDate"
                      :minDate="article.display_date"
                      :maxDate="new Date()"
                      :enableTimePicker="false"
                      format="dd MMMM yyyy"
                      week-start="0"
                      auto-apply
                    />
                  </div>
                </div>
                <ProductMetrics :metrics="metrics.readership" />
              </template>
            </div>
          </template>
          <template v-else>
            <div class="m-auto pt-8">
              <BaseLoadingSpinner class="h-20 w-20" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import { formatDate } from "@/helpers";
import { onMounted, computed, inject, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  ChevronDownIcon,
  LinkIcon,
  EnvelopeIcon,
  PencilIcon,
} from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import ProductNavigation from "@/components/ProductNavigation";
import ProductAttachments from "@/components/ProductAttachments";
import ProductRelated from "@/components/ProductRelated";
import ProductMetrics from "@/components/ProductMetrics";

export default {
  components: {
    ChevronDownIcon,
    LinkIcon,
    EnvelopeIcon,
    PencilIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ProductNavigation,
    ProductAttachments,
    ProductRelated,
    ProductMetrics,
  },
  props: {
    doc_num: {
      type: String,
    },
    title: {
      type: String,
    },
    wantsPreview: {
      type: Boolean,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const url = computed(() => window.location);
    const createNotification = inject("create-notification");
    const article = computed(() => store.state.danielDetails.document);
    const loadingArticle = computed(() => store.state.danielDetails.loading);
    const featuredArticles = computed(() => store.state.daniel.articles);
    const loadingFeaturedArticles = computed(() => store.state.daniel.loading);
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
    const isDraft = ref(route.name === "product-preview" ? true : false);
    const emailCount = computed(
      () => store.state.danielDetails.document.email_count
    );
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );

    const updateEmailCount = () => {
      store.dispatch("danielDetails/saveEmailCount");
    };
    const copyUrl = () => {
      navigator.clipboard.writeText(url.value);
      createNotification({
        message: "URL Copied to Clipboard",
        type: "success",
        canClose: false,
      });
    };
    const canManageWire = computed(() => store.getters["user/canManageWire"]);

    onMounted(() => {
      store.dispatch(
        "danielDetails/getDanielArticlesDetails",
        props.wantsPreview
      );
      store.dispatch("daniel/getDanielArticles");
      store.dispatch("relatedProducts/getRelatedDocuments", props.wantsPreview);
    });

    watch([loadingArticle], () => {
      if (!loadingArticle.value && route.name !== "product-preview") {
        document.title = article.value.title;
        metricStartDate.value = dayjs(article.value.display_date).toDate();
        metricEndDate.value = dayjs().toDate();
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

    const buildNavigation = () => {
      const matchIndex = featuredArticles.value.findIndex((featuredArticle) => {
        if (route.params.doc_num === featuredArticle.attributes.doc_num) {
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
            : featuredArticles.value[matchIndex - 1].attributes.doc_num;
        const nextArticleDocNum =
          matchIndex === featuredArticles.value.length - 1
            ? null
            : featuredArticles.value[matchIndex + 1].attributes.doc_num;
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

    watch([loadingFeaturedArticles], () => {
      if (!loadingFeaturedArticles.value) {
        buildNavigation();
      }
    });

    watch(
      () => route.params,
      () => {
        if (route.name === "product") {
          store.dispatch(
            "danielDetails/getDanielArticlesDetails",
            props.wantsPreview
          );
          store.dispatch("daniel/getDanielArticles");
          store.dispatch(
            "relatedProducts/getRelatedDocuments",
            props.wantsPreview
          );
        }
      }
    );

    return {
      formatDate,
      article,
      loadingArticle,
      loadingFeaturedArticles,
      relatedProducts,
      loadingRelatedProducts,
      metrics,
      loadingMetrics,
      metricStartDate,
      metricEndDate,
      navigation,
      isDraft,
      emailCount,
      updateEmailCount,
      copyUrl,
      canManageWire,
      url,
      canEditProduct,
    };
  },
};
</script>

<style scoped>
::v-deep .digression {
  @apply table w-auto p-8 mt-8 bg-white shadow-md;
}

::v-deep .digression-content > p {
  @apply my-4;
}

::v-deep .summary > p {
  @apply block my-4;
}

::v-deep .source-reference {
  @apply hidden align-top;
}
</style>
