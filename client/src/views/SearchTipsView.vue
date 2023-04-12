<template>
  <Markdown id="md-container" :source="search_tips" html breaks />
</template>
<script>
import Markdown from "vue3-markdown-it";

export default {
  components: {
    Markdown,
  },
  setup() {
    const search_tips = require("@/assets/advanced_search_tips.md").default;
    return {
      search_tips,
    };
  },
};
</script>
<style lang="scss">
#md-container {
  h1 {
    @apply font-semibold text-2xl py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25;
  }
  h2 {
    @apply font-medium text-xl py-4;
  }
  h3 {
    @apply font-medium py-4;
  }
  a {
    @apply text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow;
  }
  ul {
    @apply list-disc pl-8 pb-4;
  }
  td {
    @apply border border-mission-light-blue dark:border-teal-300 energy:border-energy-yellow text-center p-2;
  }
  p {
    @apply py-2;
  }
}
</style>
