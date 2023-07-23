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
</template>

<script>
import { isProductLocked, formatDate } from "@/current/helpers";

export default {
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
    return {
      formatDate,
      isProductLocked,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
