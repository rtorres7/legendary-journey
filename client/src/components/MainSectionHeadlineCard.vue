<template>
  <div class="w-full h-full">
    <router-link :to="{ name: 'article', params: { id: article.id } }">
      <BaseCard class="pb-4 h-full hover:underline">
        <div class="h-1/2">
          <img
            class="max-h-full w-full object-cover"
            :src="getImgUrl(article.image.url)"
            alt=""
          />
        </div>
        <div class="flex flex-col justify-between mt-4 px-4 h-1/2">
          <div>
            <h1
              class="
                text-black
                dark:text-teal-300
                energy:text-slate-200
                font-semibold
                text-center text-lg
              "
            >
              {{ article.title }}
            </h1>
            <p
              class="mt-4 text-md line-clamp-3 md:line-clamp-4 lg:line-clamp-6"
            >
              {{ article.content[0] }}
            </p>
          </div>
          <p
            class="
              mb-4
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
  </div>
</template>

<script>
//import { ref } from "vue";
import BaseCard from "@/components/base/BaseCard";

export default {
  components: {
    BaseCard,
  },
  props: {
    article: Object,
  },
  setup() {},
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
