<template>
  <div
    class="
      flex flex-col
      lg:block
      xl:flex xl:flex-row xl:max-h-max
      h-full
      xl:h-116
    "
  >
    <div class="h-116 md:h-full lg:pb-4 xl:pb-0 lg:flex xl:basis-2/3 lg:h-116">
      <div
        class="
          pb-4
          xl:pb-0
          border-b
          lg:border-b-0 lg:basis-1/3 lg:pr-4 lg:border-r
          xl:basis-1/3
          border-slate-900/10
          dark:border-slate-50/[0.06]
          energy:border-gray-700/25
        "
      >
        <MainSectionSitreps />
      </div>
      <div
        class="
          py-4
          lg:py-0
          h-[425px]
          lg:h-full lg:basis-2/3
          xl:basis-2/3
          lg:px-4
        "
      >
        <MainSectionHeadlineCard :article="articles[0]" />
      </div>
    </div>
    <div
      class="
        pt-4
        xl:basis-1/3 xl:pt-0
        border-t
        xl:border-t-0 xl:pl-4 xl:border-l
        border-slate-900/10
        dark:border-slate-50/[0.06]
        energy:border-gray-700/25
      "
    >
      <div
        class="
          flex flex-col
          md:flex-row
          xl:flex-col
          h-full
          space-y-4
          md:space-y-0 md:space-x-4
          xl:space-y-4 xl:space-x-0
        "
      >
        <template v-for="article in articles.slice(1, 3)" :key="article">
          <router-link
            class="md:w-1/2 xl:w-full"
            :to="{ name: 'article', params: { id: article.id } }"
          >
            <BaseCard class="h-[300px] xl:max-h-[264px]">
              <div class="h-2/3">
                <img
                  class="max-h-full w-full object-cover"
                  :src="getImgUrl(article.image.url)"
                  alt=""
                />
              </div>
              <div class="pt-4 xl:pt-2 px-4 h-1/3">
                <h1
                  class="
                    text-black
                    dark:text-teal-300
                    energy:text-slate-200
                    text-center
                    line-clamp-2
                  "
                >
                  {{ article.title }}
                </h1>
                <p
                  class="
                    mt-2
                    xl:mt-1
                    text-center text-sm text-slate-600
                    dark:text-slate-300/80
                    energy:text-slate-300/80
                  "
                >
                  {{ article.published_date }}
                </p>
              </div>
            </BaseCard>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import articles from "@/data/articles.js";
import BaseCard from "@/components/base/BaseCard";
import MainSectionSitreps from "@/components/MainSectionSitreps";
import MainSectionHeadlineCard from "@/components/MainSectionHeadlineCard";

export default {
  components: {
    BaseCard,
    MainSectionSitreps,
    MainSectionHeadlineCard,
  },
  setup() {
    console.log("test: ", articles);
    return {
      articles,
    };
  },
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>
