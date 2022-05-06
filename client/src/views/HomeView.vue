<template>
  <div class="flex text-sm py-4">
    <p class="pr-3">{{ today }}</p>
    <CalendarIcon
      class="
        cursor-pointer
        hover:text-black
        dark:hover:text-white
        energy:hover:text-white
        h-5
        w-5
      "
    ></CalendarIcon>
  </div>
  <!-- Main Section -->
  <div
    class="
      pt-4
      pb-6
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    <div class="flex flex-col lg:flex-row lg:h-116">
      <div
        class="
          pb-4
          lg:pb-0
          border-b
          lg:border-b-0 lg:basis-1/5 lg:pr-4 lg:border-r
          border-slate-900/10
          dark:border-slate-50/[0.06]
          energy:border-gray-700/25
        "
      >
        <SitrepList />
      </div>
      <div class="py-4 lg:py-0 lg:basis-3/5 lg:px-4">
        <ArticleHeadlineCard />
      </div>
      <div
        class="
          pt-4
          lg:pt-0
          border-t
          lg:border-t-0 lg:basis-1/5 lg:pl-4 lg:border-l
          border-slate-900/10
          dark:border-slate-50/[0.06]
          energy:border-gray-700/25
        "
      >
        <ThreatList />
      </div>
    </div>
  </div>
  <!-- Features Articles Section -->
  <div
    class="
      pt-4
      pb-6
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    <div class="font-semibold mb-4">Featured Articles</div>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6 text-left">
      <template v-for="index in 6" :key="index">
        <ArticleCard></ArticleCard>
      </template>
    </div>
  </div>
  <!-- Personal Section -->
  <div class="pt-4">
    <PersonalFeedList />
  </div>
  <!-- <ScrollToTopBtn /> -->
</template>

<script>
import * as dayjs from "dayjs";
import { ref } from "vue";
import ArticleHeadlineCard from "@/components/article/ArticleHeadlineCard";
import ArticleCard from "@/components/article/ArticleCard";
import PersonalFeedList from "@/components/PersonalFeedList.vue";
import SitrepList from "@/components/SitrepList.vue";
import ThreatList from "@/components/ThreatList.vue";
import { CalendarIcon } from "@heroicons/vue/outline";

export default {
  components: {
    ArticleHeadlineCard,
    CalendarIcon,
    SitrepList,
    ArticleCard,
    ThreatList,
    PersonalFeedList,
    // ScrollToTopBtn,
  },
  setup() {
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));
    return {
      today,
    };
  },
};
</script>