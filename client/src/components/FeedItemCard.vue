<template>
  <BaseCard :class="['h-full', loading ? 'animate-pulse' : '']" hoverable>
    <div class="h-full p-4 flex flex-col justify-between">
      <template v-if="loading">
        <div>
          <h1
            class="
              h-10
              mb-2
              mt-2
              lg:mb-4
              bg-slate-200
              dark:bg-slate-700
              energy:bg-zinc-700
              rounded
            "
          ></h1>
          <p
            class="
              h-20
              mb-2
              lg:mb-4
              bg-slate-200
              dark:bg-slate-700
              energy:bg-zinc-700
              rounded
            "
          ></p>
        </div>
        <div
          class="h-8 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded"
        ></div>
      </template>
      <template v-else>
        <div>
          <h1
            class="
              text-black
              dark:text-slate-100
              energy:text-zinc-100
              text-md text-center
              mb-2
              mt-2
              lg:mb-4
              line-clamp-1
            "
            :title="feed.title"
          >
            {{ feed.title }}
          </h1>
          <p class="text-sm mb-2 lg:mb-4 line-clamp-5 lg:line-clamp-4">
            {{ feed.summary }}
          </p>
        </div>
        <p
          class="
            text-slate-600
            dark:text-slate-400
            energy:text-zinc-400
            text-center text-sm
          "
        >
          {{ dayjs(feed.date_published).format("ddd, MMM D, YYYY") }}
        </p>
      </template>
    </div>
  </BaseCard>
</template>
<script>
import * as dayjs from "dayjs";

export default {
  props: {
    feed: {
      type: Object,
    },
    loading: {
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
<style lang="scss" scoped>
/* Empty on Purpose */
</style>
