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
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    <MainSection />
  </div>
  <!-- More Articles Section -->
  <div
    class="
      pt-4
      pb-6
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    <div class="font-semibold mb-4">More Articles</div>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6 text-left">
      <template v-for="article in articles.slice(2)" :key="article">
        <BaseCard class="h-[300px] xl:max-h-[264px]">
          <div class="h-2/3">
            <img
              class="max-h-full w-full object-cover"
              :src="getImgUrl(article.image.url)"
              alt=""
            />
          </div>
          <div class="pt-4 xl:pt-2 px-4 h-1/3">
            <h1
              class="
                text-black
                dark:text-teal-300
                energy:text-slate-200
                text-center
                line-clamp-2
              "
            >
              {{ article.title }}
            </h1>
            <p
              class="
                mt-2
                xl:mt-1
                text-center text-sm text-slate-600
                dark:text-slate-300/80
                energy:text-slate-300/80
              "
            >
              {{ article.published_date }}
            </p>
          </div>
        </BaseCard>
      </template>
    </div>
  </div>
  <!-- Personal Section -->
  <!-- <div class="pt-4">
    <PersonalSection
      :title="'Because you were interested in Ukraine and COVID19'"
      :items="personalArticles"
    />
    <PersonalSection :title="'Your Favorites'" :items="personalArticles" />
    <PersonalSection :title="'Recently Viewed'" :items="personalArticles" />
  </div> -->
  <!-- <ScrollToTopBtn /> -->
</template>

<script>
import * as dayjs from "dayjs";
import { ref } from "vue";
import articles from "@/data/articles.js";
import BaseCard from "@/components/base/BaseCard";
import MainSection from "@/components/MainSection";
// import FeaturedArticlesCard from "@/components/FeaturedArticlesCard";
//import PersonalSection from "@/components/PersonalSection";
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
    BaseCard,
    // MainSectionHeadlineCard,
    CalendarIcon,
    MainSection,
    //MainSectionSitreps,
    //FeaturedArticlesCard,
    //MainSectionArticles,
    //PersonalSection,
    // ScrollToTopBtn,
  },
  setup() {
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));
    return {
      articles,
      personalArticles,
      today,
    };
  },
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>
