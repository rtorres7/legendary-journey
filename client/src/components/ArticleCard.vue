<template>
  <a @click="goToArticle(article)">
    <div
      class="
        flex
        justify-between
        p-4
        border border-slate-900/10
        dark:border-slate-50/[0.12]
        energy:border-zinc-700
        h-full
        hover:underline
      "
      :class="
        isLocked(article)
          ? 'bg-slate-100 dark:bg-slate-800 energy:bg-zinc-700'
          : 'cursor-pointer'
      "
    >
      <div class="px-2 flex flex-col justify-between">
        <template v-if="isLocked(article)">
          <div class="flex mb-2 items-center">
            <LockClosedIcon
              class="mr-2 h-4 w-4"
              aria-hidden="true"
            ></LockClosedIcon>
            <span class="uppercase text-sm">Locked</span>
          </div>
        </template>
        <div>
          <span
            class="text-slate-600 dark:text-slate-300 energy:text-zinc-300"
            >{{ `${"(" + article.title_classification + ") "}` }}</span
          >
          <span class="text-black dark:text-white energy:text-white">{{
            article.title
          }}</span>
        </div>
        <div class="mt-2 text-sm">
          {{ dayjs(article.date_published).format("DD MMM YYYY") }}
        </div>
      </div>
      <div v-show="article.hasImage">
        <ArticleImage
          class="w-[165px] h-[165px] sm:max-w-full h-full"
          :article="article"
          smartRender
          @imageNotFound="toggleImgContainer(article, false)"
          @imageLoaded="toggleImgContainer(article, true)"
        />
      </div>
    </div>
  </a>
</template>

<script>
import * as dayjs from "dayjs";
import { isEmpty } from "@/helpers";
import { useRouter } from "vue-router";
import { LockClosedIcon } from "@heroicons/vue/solid";
import ArticleImage from "@/components/ArticleImage";
export default {
  components: {
    LockClosedIcon,
    ArticleImage,
  },
  props: {
    article: {
      type: Object,
    },
  },
  setup() {
    const router = useRouter();

    const isLocked = (article) => {
      return !isEmpty(article.needed) || article.org_restricted;
    };

    const goToArticle = (article) => {
      if (!isLocked(article)) {
        router.push({
          name: "article",
          params: { doc_num: article.doc_num },
        });
      }
    };

    const toggleImgContainer = (article, value) => {
      article.hasImage = value;
    };

    return {
      dayjs,
      goToArticle,
      isLocked,
      toggleImgContainer,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
