<template>
  <MaxCard
    :class="['relative h-full px-4 py-4', loading ? 'animate-pulse' : '']"
    :aria-label="
      !loading && isProductLocked(sitrep) ? 'restricted product' : ''
    "
    :title="
      !loading && isProductLocked(sitrep)
        ? 'This product has restricted access.'
        : ''
    "
    :alternate="!loading && isProductLocked(sitrep)"
    :hoverable="!loading && !isProductLocked(sitrep) ? true : false"
    :rounded="false"
  >
    <template v-if="loading">
      <div class="flex flex-col h-full justify-between">
        <div>
          <p
            class="h-5 w-28 mb-2 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
          ></p>
          <div
            class="h-8 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
          ></div>
        </div>
        <div
          class="h-6 w-28 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
        ></div>
      </div>
    </template>
    <template v-else>
      <button
        v-if="
          environment != 'production' &&
          !isProductLocked(sitrep) &&
          sitrep.state == 'posted'
        "
        class="text-slate-500 hover:text-slate-900 dark:text-slate-300 energy:text-zinc-300 absolute bottom-0 right-0 m-2"
        :aria-label="`save product ${sitrep.productNumber}`"
        @click.prevent="save(sitrep)"
      >
        <template v-if="isSavedProduct(sitrep)">
          <tippy content="Saved" placement="bottom">
            <BookmarkIconSolid aria-hidden="true" class="h-5 w-5" />
          </tippy>
        </template>
        <template v-else>
          <tippy content="Save" placement="bottom">
            <BookmarkIcon aria-hidden="true" class="h-5 w-5" />
          </tippy>
        </template>
      </button>
      <div class="flex flex-col h-full justify-between">
        <div>
          <p class="text-sm mb-2 line-clamp-2">
            {{ sitrep.product_type_name }}
          </p>
          <p class="line-clamp-2 font-medium text-lg" :title="sitrep.title">
            ({{ sitrep.title_classification }}) {{ sitrep.title }}
          </p>
        </div>
        <div
          class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
        >
          Posted {{ formatDate(sitrep.date_published) }}
        </div>
      </div>
      <template v-if="isProductLocked(sitrep)">
        <MaxProductIcon
          class="absolute w-10 h-10 m-auto bottom-0 right-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
          icon="locked"
        />
      </template>
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
import { BookmarkIcon } from "@heroicons/vue/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/24/solid";
import updateSavedStatus from "@current/composables/updateSavedStatus";
import { ref } from "vue";

export default {
  components: {
    BookmarkIcon,
    BookmarkIconSolid,
  },
  props: {
    sitrep: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const environment = ref(import.meta.env.MODE);
    const { save, savingProduct, removingProduct } = updateSavedStatus();

    return {
      formatDate,
      isProductLocked,
      environment,
      isSavedProduct,
      save,
      savingProduct,
      removingProduct,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
