<template>
  <MaxCard
    :class="['h-full', loading ? 'animate-pulse' : '']"
    :alternate="!loading && isProductLocked(product)"
    :aria-label="
      !loading && isProductLocked(product) ? 'restricted product' : ''
    "
    :title="
      !loading && isProductLocked(product)
        ? 'This product has restricted access.'
        : ''
    "
    :hoverable="!loading && !isProductLocked(product) ? true : false"
    :rounded="false"
  >
    <template v-if="loading">
      <div
        :class="[
          headline ? 'h-[45%]' : 'h-2/3',
          'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700',
        ]"
      ></div>
      <div
        :class="[
          headline ? 'h-[55%] pt-4 px-4' : 'h-1/3 pt-4 xl:pt-2 px-4',
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
            class="hidden md:block mt-4 h-12 xl:h-16 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded"
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
        :class="[headline ? 'h-[45%]' : 'h-2/3']"
        :product="product"
      />
      <div
        :class="[
          headline ? 'h-[55%] pt-4' : 'h-1/3 pt-2',
          'relative flex flex-col justify-between px-4',
        ]"
      >
        <button
          v-if="
            environment != 'production' &&
            !isProductLocked(product) &&
            product.state == 'posted'
          "
          class="text-slate-500 hover:text-slate-900 dark:text-slate-300 energy:text-zinc-300 absolute bottom-0 right-0 m-2"
          :aria-label="`save product ${product.productNumber}`"
        >
          <template v-if="isSavedProduct(product)">
            <tippy content="Saved" placement="bottom">
              <BookmarkIconSolid
                aria-hidden="true"
                :class="headline ? 'h-6 w-6' : 'h-5 w-5'"
                @click.prevent="save(product)"
                @keydown.enter.prevent="save(product)"
              />
            </tippy>
          </template>
          <template v-else>
            <tippy content="Save" placement="bottom">
              <BookmarkIcon
                aria-hidden="true"
                :class="headline ? 'h-6 w-6' : 'h-5 w-5'"
                @click.prevent="save(product)"
                @keydown.enter.prevent="save(product)"
              />
            </tippy>
          </template>
        </button>
        <div>
          <h1
            :class="[
              headline
                ? 'text-xl line-clamp-6 md:line-clamp-5 lg:line-clamp-4'
                : 'line-clamp-2',
              'text-black dark:text-slate-100 energy:text-zinc-100 text-center font-medium wrap-anywhere',
            ]"
            :title="product.title"
          >
            {{ `(${product.title_classification}) ${product.title}` }}
          </h1>
          <p
            v-show="headline"
            class="hidden mt-3 text-md md:line-clamp-4 lg:line-clamp-5 wrap-anywhere"
            :title="product.summary"
          >
            {{ `(${product.summary_classification}) ${product.summary}` }}
          </p>
        </div>
        <p
          :class="[
            headline ? '' : 'xl:mt-1',
            'mb-4 text-center text-sm text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80',
          ]"
        >
          {{ formatDate(product.date_published) }}
        </p>
        <template v-if="isProductLocked(product)">
          <MaxProductIcon
            class="absolute w-12 h-12 m-auto bottom-0 right-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
            icon="locked"
          />
        </template>
      </div>
    </template>
  </MaxCard>
  <MaxOverlay :show="savingProduct || removingProduct">
    <div class="max-w-xs inline-block">
      <p v-if="savingProduct" class="mb-4 font-semibold text-2xl">
        Saving Product...
      </p>
      <p v-if="removingProduct" class="mb-4 font-semibold text-2xl">
        Removing Product...
      </p>
      <div class="w-fit m-auto">
        <MaxLoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </MaxOverlay>
</template>
<script>
import { isProductLocked, formatDate, isSavedProduct } from "@current/helpers";
import ProductImage from "@current/components/ProductImage.vue";
import { BookmarkIcon } from "@heroicons/vue/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/24/solid";
import updateSavedStatus from "@current/composables/updateSavedStatus";
import { ref } from "vue";

export default {
  components: {
    ProductImage,
    BookmarkIcon,
    BookmarkIconSolid,
  },
  props: {
    product: {
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
    const offlineMode = import.meta.env.MODE === "offline";
    const environment = ref(import.meta.env.MODE);
    const { save, savingProduct, removingProduct } = updateSavedStatus();
    return {
      offlineMode,
      environment,
      isProductLocked,
      formatDate,
      isSavedProduct,
      save,
      savingProduct,
      removingProduct,
    };
  },
};
</script>
