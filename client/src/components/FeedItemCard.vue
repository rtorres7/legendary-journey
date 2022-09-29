<template>
  <BaseCard
    class="text-left"
    :class="carousel === true ? 'h-64' : ''"
    hoverable
  >
    <div class="p-6 flex flex-col justify-between h-full">
      <h1
        class="
          text-black
          dark:text-slate-100
          energy:text-zinc-100
          text-md
          mb-2
          mt-2
          lg:mb-4
          line-clamp-2
        "
      >
        {{ feed.title }}
      </h1>
      <p class="text-sm mb-2 lg:mb-4 line-clamp-4">
        {{ feed.summary }}
      </p>
      <p
        class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
      >
        {{ dayjs(feed.date_published).format("ddd, MMM D, YYYY") }}
      </p>
    </div>
  </BaseCard>
</template>
<script>
import * as dayjs from "dayjs";

export default {
  props: {
    carousel: {
      default: false,
      type: Boolean,
    },
    feed: Object,
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
