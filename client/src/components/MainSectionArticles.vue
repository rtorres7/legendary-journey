<template>
  <div class="flex flex-col h-full space-y-4">
    <template v-for="article in articles.slice(1, 3)" :key="article">
      <BaseCard class="h-[300px]">
        <div class="h-2/3">
          <img
            class="max-h-full w-full object-cover"
            :src="getImgUrl(article.image.url)"
            alt=""
          />
        </div>
        <div class="pt-4 px-4 h-1/3">
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
              text-center text-sm text-slate-600
              dark:text-slate-300/80
              energy:text-slate-300/80
            "
          >
            {{ article.published_date }}
          </p>
        </div>
      </BaseCard>
    </template>
  </div>
</template>
<script>
import articles from "@/data/articles.js";
import BaseCard from "@/components/base/BaseCard";

export default {
  components: {
    BaseCard,
  },
  setup() {
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
<style lang="scss">
/* Empty on Purpose */
</style>
