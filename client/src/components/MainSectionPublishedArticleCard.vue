<template>
  <BaseCard
    class="pb-4 h-full"
    :class="loading ? 'animate-pulse' : ''"
    hoverable
    :rounded="false"
  >
    <template v-if="loading">
      <div
        class="
          h-1/2
          max-h-full
          w-full
          bg-slate-200
          dark:bg-slate-700
          energy:bg-zinc-700
        "
      ></div>
      <div class="flex flex-col justify-between mt-4 px-4 h-1/2">
        <div>
          <h1
            class="
              h-6
              bg-slate-200
              dark:bg-slate-700
              energy:bg-zinc-700
              rounded
            "
          ></h1>
          <p
            class="
              mt-4
              h-24
              xl:h-44
              bg-slate-200
              dark:bg-slate-700
              energy:bg-zinc-700
              rounded
            "
          ></p>
        </div>
        <p
          class="
            mb-4
            w-1/2
            h-5
            self-center
            bg-slate-200
            dark:bg-slate-700
            energy:bg-zinc-700
            rounded
          "
        ></p>
      </div>
    </template>
    <template v-else>
      <div class="h-1/2">
        <img
          class="max-h-full w-full object-cover max-w-[600px] m-auto"
          :src="getImgUrl(article)"
          alt=""
        />
      </div>
      <div class="flex flex-col justify-between mt-4 px-4 h-1/2">
        <div>
          <h1
            class="
              text-black
              dark:text-slate-100
              energy:text-zinc-100
              font-medium
              text-center text-lg
            "
          >
            {{ article.title }}
          </h1>
          <p class="mt-4 text-md line-clamp-3 md:line-clamp-4 lg:line-clamp-6">
            {{ article.summary }}
          </p>
        </div>
        <p
          class="
            mb-4
            text-center text-sm text-slate-600
            dark:text-slate-400
            energy:text-zinc-400
          "
        >
          {{ dayjs(article.publication_date).format("ddd, MMMM D, YYYY") }}
        </p>
      </div>
    </template>
  </BaseCard>
</template>

<script>
import * as dayjs from "dayjs";
export default {
  props: {
    article: Object,
    loading: Boolean,
  },
  setup() {
    const hasArticleImage = (article) => {
      return article.images?.length > 0;
    };
    const getImgUrl = (article) => {
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
        return require("@/assets/image-not-available-wire-size.png");
      }
    };
    return {
      getImgUrl,
      dayjs,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
