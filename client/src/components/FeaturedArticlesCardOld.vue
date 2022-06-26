<template>
  <div v-for="article in articlesData.slice(1, 7)" :key="article.id">
    <BaseCard class="flex flex-col lg:flex-row md:max-w-xl hover:underline">
      <router-link :to="{ name: 'article', params: { id: article.id } }">
        <div class="p-6 flex flex-col justify-start">
          <h1
            class="
              text-black
              dark:text-teal-300
              energy:text-slate-200
              text-md
              mb-2
              lg:mb-4
              line-clamp-3
            "
          >
            {{ article.title }}
          </h1>
          <p class="text-sm mb-2 lg:mb-4 line-clamp-5">
            <!-- image for mobile view -->
            <img
              class="lg:hidden float-right w-auto h-28 rounded-lg px-1"
              :src="getImgUrl(article.image.url)"
              alt="Thumbnail for article"
            />
            {{ article.content[0] }}
          </p>
          <p
            class="
              text-slate-600
              dark:text-slate-300/80
              energy:text-slate-300/80
              text-sm
            "
          >
            {{ article.published_date }}
          </p>
        </div>
      </router-link>
      <img
        class="
          hidden
          lg:block
          w-full
          h-96
          md:h-auto
          object-cover
          lg:w-48
          rounded-t-lg
          lg:rounded-none lg:rounded-r-lg
        "
        :src="getImgUrl(article.image.url)"
        alt=""
      />
    </BaseCard>
  </div>
</template>

<script>
import { ref } from "vue";
import BaseCard from "@/components/base/BaseCard";
import articles from "@/data/articles.js";

export default {
  components: {
    BaseCard,
  },
  setup() {
    const articlesData = ref(articles);

    return {
      articlesData,
    };
  },
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
