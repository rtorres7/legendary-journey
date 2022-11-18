<template>
  <template v-if="routerError">
    <NotFound />
  </template>
  <template v-else>
    <template v-if="loadingDanielArticlesDetails && loadingDanielArticles">
      Loading...
    </template>
    <template v-else>
      <div>
        <ArticleNavigation
          :currentArticleIndex="currentArticleIndex"
          :previousArticle="previousArticle"
          :nextArticle="nextArticle"
          :totalArticles="danielArticles"
        ></ArticleNavigation>
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
          <p class="font-semibold text-sm lg:text-md uppercase">article</p>
          <h1 class="font-semibold text-2xl lg:text-3xl">
            {{ articleDetails.title }}
          </h1>
          <div class="flex space-x-4 text-sm md:text-md">
            <p>
              PUBLISHED
              {{
                dayjs(articleDetails.date_published).format("ddd, MMMM D, YYYY")
              }}
            </p>
            <p aria-hidden="true">●</p>
            <p v-if="articleDetails.authors?.length > 0">
              <template
                v-for="(author, index) in articleDetails.authors"
                :key="index"
              >
                {{ author.name
                }}<span
                  v-if="
                    articleDetails.authors?.length > 1 &&
                    index < articleDetails.authors?.length - 1
                  "
                  >,
                </span>
              </template>
            </p>
          </div>
          <div :class="['flex flex-col', computedArticleLayout]">
            <div
              v-show="showImgContainer"
              :class="adjustLayout ? 'w-[350px]' : ''"
            >
              <template v-if="article">
                <div class="h-full w-full h-[300px] sm:h-[375px] flex flex-col">
                  <ArticleImage
                    class="max-w-[400px] sm:max-w-full h-full"
                    :article="article.attributes"
                    smartRender
                    @imageLoaded="calculateLayout"
                    @imageNotFound="disableImgContainer"
                  />
                  <p class="italic text-sm pt-2">
                    {{ articleDetails.image_caption }}
                  </p>
                </div>
              </template>
            </div>
            <div class="w-full pr-2">
              <p class="whitespace-pre-line" v-if="articleDetails.html_body">
                <span class="summary" v-html="articleDetails.html_body"></span>
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
              <ChevronDownIcon
                class="h-4 w-4"
                :class="open ? 'transform rotate-180' : ''"
              />
            </DisclosureButton>
            <DisclosurePanel>
              <div class="ml-4 space-y-2 text-sm">
                <p>
                  <span class="font-semibold">Produced By: </span
                  >{{ articleDetails.producing_office }}
                </p>
                <p>
                  <span class="font-semibold">Product Type: </span
                  >{{ articleDetails.product_type_name }}
                </p>
                <p>
                  <span class="font-semibold">Document Number: </span
                  >{{ articleDetails.doc_num }}
                </p>
                <p>
                  <span class="font-semibold">Posted: </span
                  >{{
                    dayjs(articleDetails.posted_at).format(
                      "DD MMM YYYY hh:mm:ss"
                    )
                  }}
                </p>
                <p>
                  <span class="font-semibold">Publication Date: </span
                  >{{
                    dayjs(articleDetails.date_published).format("DD MMM YYYY")
                  }}
                </p>
                <p>
                  <span class="font-semibold">Contact: </span
                  >{{ articleDetails.poc_info }}
                </p>
              </div>
            </DisclosurePanel>
          </Disclosure>
          <Disclosure v-slot="{ open }">
            <DisclosureButton class="flex space-x-2 text-sm">
              <span>SOURCES</span>
              <ChevronDownIcon
                class="h-4 w-4"
                :class="open ? 'transform rotate-180' : ''"
              />
            </DisclosureButton>
            <DisclosurePanel>
              <ol class="list-decimal list-inside ml-4 space-y-2">
                <div v-for="source in articleDetails.sources" :key="source">
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
          <template v-if="!loadingDanielArticlesDetails">
            <ArticleAttachments :articleDetails="articleDetails" />
          </template>
          <template v-if="!loadingArticleMetrics">
            <ArticleMetrics 
              :articleMetrics="articleMetrics"
              :articleDetails="articleDetails"
            >
            </ArticleMetrics>
          </template>
        </div>
      </div>
    </template>
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
import ArticleImage from "@/components/ArticleImage";
import ArticleAttachments from "@/components/ArticleAttachments"
import ArticleMetrics from "@/components/ArticleMetrics";
import NotFound from "@/components/NotFound";

export default {
  components: {
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ArticleNavigation,
    ArticleImage,
    ArticleAttachments,
    ArticleMetrics,
    NotFound,
  },
  props: ["doc_num", "title"],
  setup() {
    const store = useStore();
    const route = useRoute();

    const articleDetails = computed(() => store.state.danielDetails.document);
    const danielArticles = computed(() => store.state.daniel.articles);
    const articleMetrics = computed(() => store.state.metrics);

    const adjustLayout = ref(false);

    const loadingDanielArticlesDetails = computed(
      () => store.state.danielDetails.loading
    );
    const loadingDanielArticles = computed(() => store.state.daniel.loading);
    const loadingArticleMetrics = computed(() => store.state.metrics.loading);

    const showImgContainer = ref(true);

    const computedArticleLayout = computed(() => {
      const classes = [];
      return classes;
    });

    onMounted(() => {
      store.dispatch("daniel/getDanielArticles");
      store.dispatch("danielDetails/getDanielArticlesDetails"); 
    });

    const calculateLayout = (imageWidth) => {
      console.log("calculateLayout called: ", imageWidth);
      if (imageWidth <= 350) {
        computedArticleLayout.value.push("lg:flex-row-reverse");
        adjustLayout.value = true;
      }
    };

    const disableImgContainer = () => {
      showImgContainer.value = false;
    };

    const currentArticleIndex = computed(() =>
      danielArticles.value.findIndex((article) => {
        if (article.attributes.doc_num === articleDetails.value.doc_num) {
          return true;
        }
      })
    );

    const previousArticle = computed(() =>
      danielArticles.value.find((article, index) => {
        if (index === currentArticleIndex.value - 1) {
          return true;
        }
      })
    );

    const nextArticle = computed(() =>
      danielArticles.value.find((article, index) => {
        if (index === currentArticleIndex.value + 1) {
          return true;
        }
      })
    );

    const article = computed(() =>
      danielArticles.value.find((article) => {
        if (article.attributes.doc_num === articleDetails.value.doc_num) {
          return true;
        }
      })
    );

    watch(
      () => route.params,
      () => {
        if (route.name === "article") {
          store.dispatch("danielDetails/getDanielArticlesDetails");
          store.dispatch("metrics/getMetrics");
        }
      }
    );

    watch([loadingDanielArticlesDetails], () => {
      if(!loadingDanielArticlesDetails.value) {
        store.dispatch("metrics/initDates",
          {readershipStartDate: articleDetails.value.display_date, readershipEndDate: dayjs().format("YYYY-MM-DD")})
          .then(store.dispatch("metrics/getMetrics"));
      }
    })

    return {
      dayjs,
      articleDetails,
      danielArticles,
      articleMetrics,
      loadingDanielArticlesDetails,
      loadingDanielArticles,
      loadingArticleMetrics,
      currentArticleIndex,
      previousArticle,
      nextArticle,
      article,
      disableImgContainer,
      showImgContainer,
      computedArticleLayout,
      calculateLayout,
      adjustLayout,
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
