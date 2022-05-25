<template>
    <div
      class="
        h-96
        md:h-108
        lg:h-full
        w-full
        shadow-md
        bg-cover
        cursor-pointer
        hover:opacity-90 hover:underline
        rounded-b-lg
      "
      :style="{ background: `url(${getImgUrl(firstArticle.image.url)})`, backgroundSize: 'cover' }"
    >
      <span role="img" aria-label="Thumbnail for headline article"></span>
      <router-link :to="{ name: 'article', params: { id: firstArticle.id }}">
        <div
          class="
            p-3
            bg-white bg-opacity-90
            dark:bg-slate-800 dark:bg-opacity-90
            energy:bg-gray-800 energy:bg-opacity-90
            shadow-xl
          "
        >
          <h1
            class="
              text-black
              dark:text-teal-300
              energy:text-slate-200
              font-semibold
              text-lg
              mb-2
              lg:mb-4
            "
          >
            {{ firstArticle.title }}
          </h1>
          <p class="text-md mb-2 lg:mb-4">
            {{ firstArticle.content[0] }}
          </p>
          <p
            class="
              text-sm text-slate-600
              dark:text-slate-300/80
              energy:text-slate-300/80
            "
          >
            {{ firstArticle.published_date }}
          </p>
        </div>
      </router-link>
    </div>
</template>

<script>
import articles from "@/data/articles.js";

export default {
  name: "ArticleHeadlineCard",
  data() {
    return {
      articles: articles,
    };
  },
  methods: {
    getImgUrl(url) {
      return require('@/assets/'+url)
    },
  },
  computed: {
    firstArticle() {
      return this.articles[0]
    }
  }
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
