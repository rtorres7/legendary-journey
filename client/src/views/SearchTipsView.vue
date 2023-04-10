<template>
  <div>
    <div
      class="py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
    >
      <p class="font-semibold text-2xl">{{ tips.title }}</p>
    </div>
    <div class="flex space-x-8">
      <div class="lg:min-w-[215px] p-6">
        <div
          class="sticky top-[75px] lg:top-[125px] flex flex-col pr-6 border-r-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
        >
          <p class="font-semibold pb-4">Table of Contents</p>
          <template v-for="section in tips.sections" :key="section">
            <div
              class="cursor-pointer inline-flex rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800/75 energy:hover:bg-zinc-700/75"
              @click="scroll(section.shortName)"
            >
              <span class="sr-only">{{ section.shortName }}</span>
              <button class="text-sm">{{ section.shortName }}</button>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-col space-y-8">
        <div class="pt-8">
          {{ tips.summary }}
        </div>
        <div
          v-for="section in tips.sections"
          :key="section"
          :id="section.shortName"
        >
          <p class="font-semibold text-xl pb-4">
            {{ section.title }}
          </p>
          <p v-html="section.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { searchTips } from "@/data";
import { ref } from "vue";

export default {
  setup() {
    const tips = ref(searchTips);

    const scroll = (id) => {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    };

    return {
      tips,
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
