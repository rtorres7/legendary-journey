<template>
  <template v-for="article in articlesData.slice(1, 7)" :key="article.id">
    <BaseCard class="flex flex-col hover:underline h-80 max-w-[600px]">
      <div class="flex flex-col justify-start max-h-full">
        <img
          class="object-cover h-2/3"
          :src="getImgUrl(article.image.url)"
          alt="Thumbnail for article"
        />
        <div class="h-1/3 p-4">
          <h1
            class="
              text-black
              dark:text-teal-300
              energy:text-slate-200
              text-center
              mb-2
              line-clamp-2
            "
          >
            {{ article.title }}
          </h1>
          <p
            class="
              text-slate-600
              dark:text-slate-300/80
              energy:text-slate-300/80
              text-center text-sm
            "
          >
            {{ article.published_date }}
          </p>
        </div>
      </div>
    </BaseCard>
  </template>
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
