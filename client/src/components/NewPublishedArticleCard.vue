<template>
  <BaseCard
    class="h-full"
    :class="loading ? 'animate-pulse' : ''"
    hoverable
    :rounded="false"
  >
    <template v-if="loading">
      <div
        class="h-2/3 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
      ></div>
      <div class="flex flex-col justify-between pt-4 xl:pt-2 px-4 h-1/3">
        <h1
          class="h-6 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded"
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
            energy:bg-zinc-700
            rounded
          "
        ></p>
      </div>
    </template>
    <template v-else>
      <div class="h-2/3 relative">
        <div
          v-show="hasArticleImage(article)"
          :class="[
            'h-full w-full absolute',
            'blur bg-center bg-no-repeat bg-cover',
          ]"
          :style="{ background: 'url(' + getImgUrl(article) + ')' }"
        ></div>
        <img
          :class="
            hasArticleImage(article)
              ? 'absolute h-full max-w-[350px] inset-x-0 mx-auto z-[5]'
              : ' max-h-full object-cover w-full max-w-[450px] m-auto'
          "
          :src="getImgUrl(article)"
          alt=""
        />
      </div>
      <div class="flex flex-col justify-between pt-2 px-4 h-1/3">
        <h1
          class="
            text-black
            dark:text-slate-100
            energy:text-zinc-100
            text-center
            font-medium
            line-clamp-2
          "
        >
          {{ `(${article.title_classification}) ${article.title}` }}
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
    article: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    headline: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hasArticleImage = (article) => {
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
          window.location.origin +
          "/documents/" +
          article.doc_num +
          "/images/article?updated_at=" +
          updatedAt
        );
      } else {
        if (stringOnly) {
          return "@/assets/image-not-available-wire-size.png";
        }
        return require("@/assets/image-not-available-wire-size.png");
      }
    };
    return {
      hasArticleImage,
      getImgUrl,
      dayjs,
    };
  },
};
</script>
