<template>
  <div>
    <div
      class="py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
    >
      <h1 class="font-semibold text-2xl">Search Help and Advanced Usage</h1>
    </div>
    <div class="flex space-x-8">
      <div class="lg:min-w-[215px] p-6">
        <div
          class="sticky top-[75px] lg:top-[125px] flex flex-col pr-6 border-r-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
        >
          <p class="font-semibold pb-4">Table of Contents</p>
          <template v-for="section in table_of_contents" :key="section">
            <div
              class="cursor-pointer inline-flex rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800/75 energy:hover:bg-zinc-700/75"
              @click="scroll(section)"
            >
              <span class="sr-only">{{ section }}</span>
              <button class="text-sm">{{ section }}</button>
            </div>
          </template>
        </div>
      </div>
      <div class="pt-8">
        <Markdown :source="search_tips" html breaks />
      </div>
    </div>
  </div>
</template>
<script>
import Markdown from "vue3-markdown-it";

const table_of_contents = [
  "Terms",
  "Operators",
  "AND",
  "OR",
  "NOT",
  "Capitalization",
  "Grouping",
  "Stemming",
  "Analyzers",
  "Boosting",
  "Proximity",
];

export default {
  components: {
    Markdown,
  },
  setup() {
    const search_tips = require("@/assets/advanced_search_tips.md").default;

    const scroll = (id) => {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    };

    return {
      table_of_contents,
      search_tips,
      scroll,
    };
  },
};
</script>
<style lang="scss">
.color {
  @apply text-mission-light-blue;
}
.dark .color {
  @apply text-teal-300;
}
.energy .color {
  @apply text-energy-yellow;
}
</style>
