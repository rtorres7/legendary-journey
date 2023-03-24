<template>
  <MaxCard
    :class="[
      'h-full',
      loading
        ? 'animate-pulse'
        : isProductLocked(article)
        ? 'bg-slate-200/50 dark:bg-slate-700/50 energy:bg-zinc-700/50'
        : '',
    ]"
    :aria-label="
      !loading && isProductLocked(article) ? 'restricted product' : ''
    "
    :title="
      !loading && isProductLocked(article)
        ? 'This product has restricted access.'
        : ''
    "
    :hoverable="!loading && !isProductLocked(article) ? true : false"
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
      <ProductImage
        :class="[headline ? 'h-3/5' : 'h-2/3']"
        :article="article"
      />
      <div
        :class="[
          headline ? 'h-2/5' : 'h-1/3',
          'relative flex flex-col justify-between pt-2 px-4',
        ]"
      >
        <div>
          <h1
            :class="[
              headline
                ? 'text-lg line-clamp-4 md:line-clamp-3'
                : 'line-clamp-2',
              'text-black dark:text-slate-100 energy:text-zinc-100 text-center font-medium wrap_anywhere',
            ]"
            :title="article.title"
          >
            {{ `(${article.title_classification}) ${article.title}` }}
          </h1>
          <p
            v-show="headline"
            class="hidden mt-3 text-md lg:line-clamp-2 xl:line-clamp-3 wrap_anywhere"
            :title="article.summary"
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
          {{ formatDate(article.date_published) }}
        </p>
        <template v-if="isProductLocked(article)">
          <MaxProductIcon
            class="absolute w-12 h-12 m-auto bottom-0 right-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
            icon="locked"
          />
        </template>
      </div>
    </template>
  </MaxCard>
</template>
<script>
import { isProductLocked, formatDate } from "@/helpers";
import ProductImage from "@/components/ProductImage";

export default {
  components: {
    ProductImage,
  },
  props: {
    article: {
      type: Object,
      default: () => {},
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
      isProductLocked,
      formatDate,
    };
  },
};
</script>
<style scoped lang="scss">
.wrap_anywhere {
  overflow-wrap: anywhere;
}
</style>
