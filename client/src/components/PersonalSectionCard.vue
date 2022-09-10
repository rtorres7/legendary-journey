<template>
  <BaseCard
    class="text-left"
    :class="carousel === true ? 'h-64' : ''"
    hoverable
  >
    <div class="p-6 flex flex-col justify-between h-full">
      <div class="flex flex-wrap gap-y-2 mb-2 lg:mb-4">
        <div
          class="
            flex-col
            bg-slate-200
            text-slate-800 text-xs
            font-medium
            mr-2
            px-2.5
            py-1
            rounded-3xl
            shadow-lg
            dark:bg-slate-600 dark:text-slate-300
            energy:bg-zinc-700/40 energy:text-zinc-100
          "
        >
          #{{ article.tag1 }}
        </div>
        <div
          class="
            flex-col
            bg-slate-200
            text-slate-800 text-xs
            font-medium
            mr-2
            px-2.5
            py-1
            rounded-3xl
            shadow-lg
            dark:bg-slate-600 dark:text-slate-300
            energy:bg-zinc-700/40 energy:text-zinc-100
          "
        >
          #{{ article.tag2 }}
        </div>
      </div>
      <h1
        class="
          text-black
          dark:text-slate-100
          energy:text-zinc-100
          text-md
          mb-2
          mt-2
          lg:mb-4
          line-clamp-3
        "
      >
        {{ article.title }}
      </h1>
      <p class="text-sm mb-2 lg:mb-4 line-clamp-3">
        {{ article.summary }}
      </p>
      <p
        class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
      >
        {{ article.date }}
      </p>
    </div>
  </BaseCard>
</template>

<script>
export default {
  props: {
    carousel: {
      default: false,
      type: Boolean,
    },
    article: Object,
  },
};
</script>
<style lang="scss" scoped>
/* Empty on Purpose */
</style>
