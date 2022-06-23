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
        <MainSectionSitreps />
      </div>
      <div class="py-4 lg:py-0 lg:basis-3/5 lg:px-4">
        <MainSectionHeadlineCard />
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
        <MainSectionThreats />
      </div>
    </div>
  </div>
  <!-- Featured Articles Section -->
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
      <FeaturedArticlesCard></FeaturedArticlesCard>
    </div>
  </div>
  <!-- Personal Section -->
  <div class="pt-4">
    <PersonalSection
      :title="'Because you were interested in Ukraine and COVID19'"
      :items="personalArticles"
    />
    <PersonalSection :title="'Your Favorites'" :items="personalArticles" />
    <PersonalSection :title="'Recently Viewed'" :items="personalArticles" />
  </div>
  <!-- <ScrollToTopBtn /> -->
</template>

<script>
import * as dayjs from "dayjs";
import { ref } from "vue";
import MainSectionHeadlineCard from "@/components/MainSectionHeadlineCard";
import FeaturedArticlesCard from "@/components/FeaturedArticlesCard";
import PersonalSection from "@/components/PersonalSection.vue";
import MainSectionSitreps from "@/components/MainSectionSitreps";
import MainSectionThreats from "@/components/MainSectionThreats.vue";
import { CalendarIcon } from "@heroicons/vue/outline";

const personalArticles = [
  {
    id: 1,
    title: "(U) Moscow Lashes Out, Accusing West of Proxy War",
    summary:
      "(U) At a meeting of military leaders, the U.S. accelerated its drive to deter Russia’s offensive. Germany said it would send Ukraine heavy weapons for the first time.",
    tag1: "Russia",
    tag2: "Ukraine",
    date: "24 April 2022",
  },
  {
    id: 2,
    title: "(U) Vice President Kamala Harris Tests Positive for Coronavirus",
    summary:
      "(U) Ms. Harris is the highest-ranking official in Washington to be infected. She has not had recent contact with President Biden, her office said. If you experience COVID19 symptoms, please get tested. She has not had recent contact with President Biden, her office said.",
    tag1: "COVID19",
    tag2: "C.D.C.",
    date: "23 April 2022",
  },
  {
    id: 3,
    title:
      "(U) Coronavirus Has Infected Most Americans at Least Once, C.D.C. Says",
    summary:
      "(U) By February 2022, nearly 60 percent of the population had signs of exposure, almost double the proportion seen in December 2021, the agency’s data showed.",
    tag1: "COVID19",
    tag2: "C.D.C.",
    date: "22 April 2022",
  },
  {
    id: 4,
    title: "(U) Moscow Lashes Out, Accusing West of Proxy War",
    summary:
      "(U) At a meeting of military leaders, the U.S. accelerated its drive to deter Russia’s offensive. Germany said it would send Ukraine heavy weapons for the first time.",
    tag1: "Russia",
    tag2: "Ukraine",
    date: "21 April 2022",
  },
  {
    id: 5,
    title: "(U) Vice President Kamala Harris Tests Positive for Coronavirus",
    summary:
      "(U) Ms. Harris is the highest-ranking official in Washington to be infected. She has not had recent contact with President Biden, her office said. If you experience COVID19 symptoms, please get tested. She has not had recent contact with President Biden, her office said.",
    tag1: "COVID19",
    tag2: "C.D.C.",
    date: "22 April 2022",
  },
];

export default {
  components: {
    MainSectionHeadlineCard,
    CalendarIcon,
    MainSectionSitreps,
    FeaturedArticlesCard,
    MainSectionThreats,
    PersonalSection,
    // ScrollToTopBtn,
  },
  setup() {
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));
    return {
      personalArticles,
      today,
    };
  },
};
</script>
