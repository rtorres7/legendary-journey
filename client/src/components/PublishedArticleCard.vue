<template>
  <BaseCard
    :class="['h-full', loading ? 'animate-pulse' : '']"
    hoverable
    :rounded="false"
  >
    <template v-if="loading">
      <div
        :class="[
          headline ? 'h-3/5' : 'h-2/3',
          'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700',
        ]"
      ></div>
      <div
        :class="[
          headline ? 'h-2/5 pt-4 px-4' : 'h-1/3 pt-4 xl:pt-2 px-4',
          'flex flex-col justify-between ',
        ]"
      >
        <div>
          <h1
            :class="[
              headline ? 'h-24 md:h-20' : 'h-6',
              'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded',
            ]"
          ></h1>
          <p
            v-show="headline"
            class="hidden lg:block mt-4 h-12 xl:h-16 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded"
          ></p>
        </div>
        <p
          :class="[
            headline ? 'mb-2' : 'mb-2 xl:mt-1',
            'h-5 w-1/2 self-center bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded',
          ]"
        ></p>
      </div>
    </template>
    <template v-else>
      <ArticleImage
        :class="[headline ? 'h-3/5' : 'h-2/3']"
        :article="article"
      />
      <div
        :class="[
          headline ? 'h-2/5' : 'h-1/3',
          'flex flex-col justify-between pt-2 px-4',
        ]"
      >
        <div>
          <h1
            :class="[
              headline
                ? 'text-lg line-clamp-4 md:line-clamp-3'
                : 'line-clamp-2',
              'text-black dark:text-slate-100 energy:text-zinc-100 text-center font-medium',
            ]"
          >
            {{ `(${article.title_classification}) ${article.title}` }}
          </h1>
          <p
            v-show="headline"
            class="hidden mt-3 text-md lg:line-clamp-2 xl:line-clamp-3"
          >
            {{ `(${article.summary_classification}) ${article.summary}` }}
          </p>
        </div>
        <p
          :class="[
            headline ? '' : 'xl:mt-1',
            'mb-2 text-center text-sm text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80',
          ]"
        >
          {{ dayjs(article.date_published).format("ddd, MMMM D, YYYY") }}
        </p>
      </div>
    </template>
  </BaseCard>
</template>
<script>
import * as dayjs from "dayjs";
import ArticleImage from "@/components/ArticleImage";

export default {
  components: {
    ArticleImage,
  },
  props: {
    article: {
      type: Object,
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
    return {
      dayjs,
    };
  },
};
</script>
