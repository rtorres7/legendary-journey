<template>
  <div class="flex flex-col space-y-8">
    <div
      class="py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
    >
      <p class="font-semibold text-2xl">{{ tips.title }}</p>
    </div>
    <div>
      {{ tips.summary }}
    </div>
    <div v-for="section in tips.sections" :key="section">
      <p class="font-semibold text-xl pb-4">{{ section.title }}</p>
      <p v-html="section.content"></p>
    </div>
  </div>
</template>
<script>
import { searchTips } from "@/data";
import { ref } from "vue";

export default {
  setup() {
    const tips = ref(searchTips);

    return {
      tips,
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
