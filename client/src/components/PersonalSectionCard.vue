<template>
  <BaseCard
    class="hover:underline text-left"
    :class="carousel === true ? 'h-64' : ''"
  >
    <div class="p-6 flex flex-col justify-between h-full">
      <div class="flex flex-wrap gap-y-2 mb-2 lg:mb-4">
        <!-- <template v-for="index in 2" :key="index"> -->
        <div
          class="
            flex-col
            bg-gray-200
            text-gray-800 text-xs
            font-medium
            mr-2
            px-2.5
            py-1
            rounded-3xl
            shadow-lg
            dark:bg-gray-600 dark:text-gray-300
            energy:bg-gray-700/40 energy:text-energy-yellow
          "
        >
          #{{ article.tag1 }}
        </div>
        <div
          class="
            flex-col
            bg-gray-200
            text-gray-800 text-xs
            font-medium
            mr-2
            px-2.5
            py-1
            rounded-3xl
            shadow-lg
            dark:bg-gray-600 dark:text-gray-300
            energy:bg-gray-700/40 energy:text-energy-yellow
          "
        >
          #{{ article.tag2 }}
        </div>
        <!-- </template> -->
      </div>
      <h1
        class="
          text-black
          dark:text-teal-300
          energy:text-slate-200
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
        class="
          text-slate-600
          dark:text-slate-300/80
          energy:text-slate-300/80
          text-sm
        "
      >
        {{ article.date }}
      </p>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from "@/components/base/BaseCard";
export default {
  components: {
    BaseCard,
  },
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
