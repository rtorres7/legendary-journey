<template>
  <a @click="goToArticle(sitrep)">
    <BaseCard
      :class="[
        'h-full px-4 py-4',
        loading ? 'animate-pulse' : '',
        isLocked(sitrep)
          ? 'bg-slate-200/50 dark:bg-slate-700/50 energy:bg-zinc-600/50'
          : 'cursor-pointer',
      ]"
      :hoverable="!isLocked(sitrep) ? true : false"
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
          <template v-if="isLocked(sitrep)">
            <div class="flex mb-2 items-center">
              <LockClosedIcon class="mr-2 h-4 w-4" aria-hidden="true" />
              <span class="uppercase text-sm">Locked</span>
            </div>
          </template>
          <div>
            <p class="text-sm mb-2 line-clamp-2">
              {{ sitrep.product_type_name }}
            </p>
            <p class="line-clamp-2 font-medium">
              {{ sitrep.title }}
            </p>
          </div>
          <div
            class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
          >
            Posted {{ sitrep.date_published }}
          </div>
        </div>
      </template>
    </BaseCard>
  </a>
</template>

<script>
import { isEmpty } from "@/helpers";
import { LockClosedIcon } from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";

export default {
  components: {
    LockClosedIcon,
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
  setup(props) {
    const router = useRouter();
    const isLocked = () => {
      if (!props.loading) {
        return !isEmpty(props.sitrep.needed) || props.sitrep.org_restricted;
      }
    };
    const goToArticle = (sitrep) => {
      if (!isLocked(sitrep)) {
        router.push({
          name: "article",
          params: { doc_num: sitrep.doc_num },
        });
        console.log(sitrep.org_restricted);
      }
    };

    return {
      isLocked,
      goToArticle,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
