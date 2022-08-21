<template>
  <BaseCard
    class="h-[300px] xl:max-h-[264px]"
    :class="loading ? 'animate-pulse' : ''"
    hoverable
  >
    <template v-if="loading">
      <div
        class="h-2/3 bg-slate-200 dark:bg-slate-700 energy:bg-gray-700"
      ></div>
      <div class="flex flex-col justify-between pt-4 xl:pt-2 px-4 h-1/3">
        <h1
          class="h-6 bg-slate-200 dark:bg-slate-700 energy:bg-gray-700 rounded"
        ></h1>
        <p
          class="
            mb-2
            xl:mt-1
            h-5
            w-1/2
            self-center
            bg-slate-200
            dark:bg-slate-700
            energy:bg-gray-700
            rounded
          "
        ></p>
      </div>
    </template>
    <template v-else>
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
            dark:text-slate-100
            energy:text-gray-100
            text-center
            font-medium
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
    </template>
  </BaseCard>
</template>

<script>
export default {
  props: {
    article: Object,
    loading: Boolean,
  },
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>
