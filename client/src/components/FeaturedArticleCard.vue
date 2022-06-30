<template>
  <BaseCard class="h-[300px] xl:max-h-[264px]">
    <div class="h-2/3">
      <img
        class="max-h-full w-full object-cover"
        :src="getImgUrl(article.image.url)"
        alt=""
      />
    </div>
    <div class="flex flex-col justify-between pt-4 xl:pt-2 px-4 h-1/3">
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
          mb-2
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
</template>

<script>
import BaseCard from "@/components/base/BaseCard";

export default {
  components: {
    BaseCard,
  },
  props: {
    article: Object,
  },
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>
