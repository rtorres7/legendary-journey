<template>
  <Markdown id="md-container" :source="search_tips" html breaks />
</template>
<script>
import Markdown from "vue3-markdown-it";
import { ref, onMounted } from "vue";

export default {
  components: {
    Markdown,
  },
  setup() {
    const search_tips = ref();
    const markdown = () => {
      import("@/assets/advanced_search_tips.md").then((res) => {
        fetch(res.default)
          .then((response) => response.text())
          .then((text) => (search_tips.value = text));
      });
    };

    onMounted(() => {
      markdown();
    });

    return {
      search_tips,
      markdown,
    };
  },
};
</script>
<style lang="scss">
#md-container {
  h1 {
    @apply font-semibold text-2xl pt-4 pb-2 mb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25;
  }
  h2 {
    @apply font-medium text-xl mt-6 mb-4 pb-2 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25;
  }
  h3 {
    @apply font-medium mt-4 mb-2;
  }
  hr {
    @apply border-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50;
  }
  em {
    @apply bg-transparent;
  }
  code {
    @apply text-sm rounded-md p-1 bg-slate-100 dark:bg-slate-700 energy:bg-zinc-700;
  }
  a {
    @apply hover:underline text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow;
  }
  > ul {
    @apply list-disc pl-8 pb-4;
    ul {
      list-style-type: circle;
      @apply pl-8;
    }
  }
  > table {
    td {
      @apply border border-slate-900/50 dark:border-slate-700 energy:border-zinc-700 text-center py-2 px-4;
    }
    tr:nth-child(2n) {
      @apply bg-slate-100/75 dark:bg-slate-600/10 energy:bg-zinc-600/10;
    }
    th {
      @apply border border-slate-900/50 dark:border-slate-700 energy:border-zinc-700 text-center py-2 px-4;
    }
  }
  p {
    @apply mt-2 mb-4;
  }
}
</style>
