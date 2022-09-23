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
          lg:space-x-5
          mb-8
        "
      >
        <div class="flex flex-col space-y-4">
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
              <template v-for="author, index in articleDetails.authors" :key="index">
                {{ author.name }}<span v-if="articleDetails.authors?.length > 1 && index < articleDetails.authors?.length - 1">, </span>
              </template>
            </p>
          </div>
          <template v-if="article">
            <div v-show="hasArticleImage" class="lg:w-5/6 max-h-96">
              <img
                class="max-h-full w-full object-cover"
                :src="getImgUrl(article)"
                alt="article image"
              />
            </div> 
          </template>
          <p class="italic text-sm">
            {{ articleDetails.image_caption }}
          </p>
          <p class="whitespace-pre-line" v-if="articleDetails.html_body">
            <!-- {{ articleDetails.html_body.join("\n\n") }} -->
            <span v-html="articleDetails.html_body"></span>
          </p>
          <!-- <div class="digression">
            <p class="italic">
              (U) For additional information:
            </p>
            <ul class="list-disc list-inside">
              <li v-for="index in 2" :key="index" class="italic text-sm">
                <router-link to="#" class="hover:underline">
                  (U) This is the title for an article with additional
                  information.
                </router-link>
              </li>
            </ul>
          </div> -->
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
                <div
                  v-for="source in articleDetails.sources"
                  :key="source"
                >
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
      </div>
    </template>
  </template>
</template>

<script>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ArticleNavigation from "@/components/ArticleNavigation.vue";
import NotFound from "@/components/NotFound";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import * as dayjs from "dayjs";

export default {
  components: {
    ArticleNavigation,
    NotFound,
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  props: ["doc_num", "title"],
  setup() {
    const store = useStore();
    const route = useRoute();

    const articleDetails = computed(() => store.state.danielDetails.document);
    const danielArticles = computed(() => store.state.daniel.articles);

    const loadingDanielArticlesDetails = computed(
      () => store.state.danielDetails.loading
    );
    const loadingDanielArticles = computed(() => store.state.daniel.loading);

    onMounted(() => {
      store.dispatch("daniel/getDanielArticles");
      store.dispatch("danielDetails/getDanielArticlesDetails");
    });

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

    const hasArticleImage = (article) => {
      console.log('article: ', article)
      return article.images?.length > 0;
    };

    const getImgUrl = (article, stringOnly) => {
      if (hasArticleImage(article)) {
        let updatedAt;
        if (Array.isArray(article.images)) {
          updatedAt = article.images.filter(
            (image) => image.usage == "article"
          )[0].updated_at;
        } else if (article.images && article.images.table.article) {
          updatedAt = article.images.table.article.table.updated_at;
        } else {
          updatedAt = "";
        }
        return (
          "/documents/" +
          article.doc_num +
          "/images/article?updated_at=" +
          updatedAt
        );
      } else {
          if (stringOnly) {
          //   return "@/assets/image-not-available-wire-size.png";
          // }
          // return require("@/assets/image-not-available-wire-size.png");
            return "@/assets/lion_wire_size.jpg";
          }
          return require("@/assets/lion_wire_size.jpg");
        }
    };   

    watch(
      () => route.params,
      () => {
        if (route.name === "article") {
          store.dispatch("danielDetails/getDanielArticlesDetails");
        }
      }
    );

    return {
      dayjs,
      articleDetails,
      danielArticles,
      loadingDanielArticlesDetails,
      loadingDanielArticles,
      currentArticleIndex,
      previousArticle,
      nextArticle,
      article,
      hasArticleImage,
      getImgUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
  ::v-deep .digression {
    display: table;
    width: auto;
    padding: 2em;
    margin: 2em 0;
    background: #F7F7F8;
    border: none;
  }
  ::v-deep .portion_marked_field {
    color: #6A737B !important;
    font-size: 85% !important;
  }
  ::v-deep p {
    display: block;
    margin-block-start: 1em !important;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  ::v-deep .source-reference {
    display: none;
    font-size: 0.65625rem;
    vertical-align: top;
  }
</style>
