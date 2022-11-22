<template>
  <template v-if="loadingArticle">
    <div class="max-w-fit m-auto mt-[24vh]">
      <BaseLoadingSpinner
        class="h-28 w-28"
      />
    </div>  
  </template>
  <template v-else>
    <div v-if="!loadingFeaturedArticles && navigation">
      <ArticleNavigation
        :navigation="navigation"
      />
    </div>
    <div
      class="
        flex flex-wrap
        md:flex-nowrap
        justify-between
        md:space-x-10
        lg:space-x-15
        mb-8
        "
    >
      <div class="md:basis-9/12 flex flex-col space-y-4">
        <p class="font-semibold text-sm lg:text-md uppercase">
          article
        </p>
        <h1 class="font-semibold text-2xl lg:text-3xl">
          {{ article.title }}
        </h1>
        <div class="flex space-x-4 text-sm md:text-md">
          <p>
            {{ `${article.state} -` }}
            {{
              dayjs(article.date_published).format("ddd, MMMM D, YYYY")
            }}
          </p>
          <p aria-hidden="true">
            ●
          </p>
          <p v-if="article.authors?.length > 0">
            <template v-for="(author, index) in article.authors" :key="index">
              {{ author.name
              }}<span v-if="article.authors?.length > 1 && index < article.authors?.length - 1">,
              </span>
            </template>
          </p>
        </div>
        <div class="flex flex-col">
          <div
            v-show="article.product_image"
            class="h-full w-full h-[300px] sm:h-[375px] flex flex-col"
          >
            <img
              :src="`/documents/${article.doc_num}/images/article?updated_at=${article.updated_at}`"
              class="max-w-[375px] h-full"
            >
          </div>
          <div class="w-full pr-2">
            <p v-if="article.html_body" class="whitespace-pre-line">
              <span class="summary" v-html="article.html_body" />
            </p>
          </div>
        </div>
        <p
          class="
              font-semibold
              border-t-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pt-4
            "
        >
          Document Details
        </p>
        <Disclosure v-slot="{ open }">
          <DisclosureButton class="flex space-x-2 text-sm">
            <span>CONTENTS</span>
            <ChevronDownIcon class="h-4 w-4" :class="open ? 'transform rotate-180' : ''" />
          </DisclosureButton>
          <DisclosurePanel>
            <div class="ml-4 space-y-2 text-sm">
              <p>
                <span class="font-semibold">Produced By: </span>{{ article.producing_office }}
              </p>
              <p>
                <span class="font-semibold">Product Type: </span>{{ article.product_type_name }}
              </p>
              <p>
                <span class="font-semibold">Document Number: </span>{{ article.doc_num }}
              </p>
              <p>
                <span class="font-semibold">Posted: </span>{{
                  dayjs(article.posted_at).format(
                    "DD MMM YYYY hh:mm:ss"
                  )
                }}
              </p>
              <p>
                <span class="font-semibold">Publication Date: </span>{{
                  dayjs(article.date_published).format("DD MMM YYYY")
                }}
              </p>
              <p>
                <span class="font-semibold">Contact: </span>{{ article.poc_info }}
              </p>
            </div>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure v-slot="{ open }">
          <DisclosureButton class="flex space-x-2 text-sm">
            <span>SOURCES</span>
            <ChevronDownIcon class="h-4 w-4" :class="open ? 'transform rotate-180' : ''" />
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
        </Disclosure>
      </div>
      <div class="flex flex-col pb-8 space-y-3 mt-10">
        <ArticleAttachments :article="article" />
        <!-- TODO: Use metadata featuresAvailable.relatedDocs for condition -->
        <template v-if="!loadingRelatedProducts">
          <ArticleRelatedProducts
            :relatedProducts="relatedProducts"
          />
        </template>
        <!-- TODO: Use metadata featuresAvailable.metrics for condition -->
        <template v-if="!loadingMetrics && !isDraft || metrics.uniqueReaders !== 0">
          <ArticleMetrics 
            :articleMetrics="metrics"
            :article="article"
          />
        </template>
      </div>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import { onMounted, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import ArticleNavigation from "@/components/ArticleNavigation";
import ArticleAttachments from "@/components/ArticleAttachments"
import ArticleRelatedProducts from "@/components/ArticleRelatedProducts"
import ArticleMetrics from "@/components/ArticleMetrics";

export default {
  components: {
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ArticleNavigation,
    ArticleAttachments,
    ArticleRelatedProducts,
    ArticleMetrics
  },
  props: ["doc_num", "title"],
  setup() {
    const store = useStore();
    const route = useRoute();

    const article = computed(() => store.state.danielDetails.document);
    const loadingArticle = computed(() => store.state.danielDetails.loading);
    const featuredArticles = computed(() => store.state.daniel.articles);
    const loadingFeaturedArticles = computed(() => store.state.daniel.loading);
    const relatedProducts = computed(() => store.state.relatedProducts.relatedDocuments);
    const loadingRelatedProducts = computed(() => store.state.relatedProducts.loading);
    const metrics = computed(() => store.state.metrics);
    const loadingMetrics = computed(() => store.state.metrics.loading);
    const navigation = ref(null)
    const isDraft = ref(route.name === 'article-preview' ? true : false)

    onMounted(() => {
      store.dispatch("danielDetails/getDanielArticlesDetails");
      store.dispatch("daniel/getDanielArticles")
      store.dispatch("relatedProducts/getRelatedDocuments");
    });

    /*
      Article needs to load first before firing a metrics call.
    */
    watch([loadingArticle], () => {
      if (!loadingArticle.value) {
        store.dispatch("metrics/initDates",
        {readershipStartDate: article.value.display_date, readershipEndDate: dayjs().format("YYYY-MM-DD")})
        .then(store.dispatch("metrics/getMetrics"));
      }
    });

    const buildNavigation = () => {
      const matchIndex  = featuredArticles.value.findIndex(featuredArticle => {
          if (route.params.doc_num === featuredArticle.attributes.doc_num) {
            return true;
          }
        })
        if(matchIndex !== -1){
          navigation.value = {
            currentArticle: {
              position: matchIndex + 1
            },
            totalArticles : featuredArticles.value.length
          }
          const prevArticleDocNum = matchIndex === 0 ? null : featuredArticles.value[matchIndex - 1].attributes.doc_num
          const nextArticleDocNum = matchIndex === (featuredArticles.value.length - 1) ? null : featuredArticles.value[matchIndex + 1].attributes.doc_num
          if(prevArticleDocNum){
            navigation.value['previousArticle'] = {
              doc_num : prevArticleDocNum
            }
          }
          if(nextArticleDocNum){
            navigation.value['nextArticle'] = {
              doc_num : nextArticleDocNum
            }
          }
        }
    }

    watch([loadingFeaturedArticles], () => {
      if (!loadingFeaturedArticles.value) {
        buildNavigation()
      }
    });

    watch(
      () => route.params,
      () => {
        if (route.name === "article") {
          store.dispatch("danielDetails/getDanielArticlesDetails");
          store.dispatch("daniel/getDanielArticles")
          store.dispatch("relatedProducts/getRelatedDocuments");   
          // store.dispatch("metrics/initDates",
          //   {readershipStartDate: article.value.display_date, readershipEndDate: dayjs().format("YYYY-MM-DD")})
          //   .then(store.dispatch("metrics/getMetrics"));          
        }
      }
    );

    return {
      dayjs,
      article,
      loadingArticle,
      loadingFeaturedArticles,
      relatedProducts,
      loadingRelatedProducts,
      metrics,
      loadingMetrics,
      navigation,
      isDraft
    };
  },
};
</script>

<style scoped>
::v-deep .digression {
  @apply table w-auto p-8 mt-8 bg-white shadow-md;
}

::v-deep .digression-content>p {
  @apply my-4;
}

::v-deep .summary>p {
  @apply block my-4;
}

::v-deep .source-reference {
  @apply hidden align-top;
}
</style>
