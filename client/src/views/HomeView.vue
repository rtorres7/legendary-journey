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
      energy:border-zinc-700/50
    "
  >
    <div
      class="
        flex flex-col
        lg:block
        xl:flex xl:flex-row xl:max-h-max
        h-full
        xl:h-116
      "
    >
      <!-- Main Section Sit. Awareness & Headline Container -->
      <div
        class="h-116 md:h-full lg:pb-4 xl:pb-0 lg:flex xl:basis-2/3 lg:h-116"
      >
        <div
          class="
            pb-4
            xl:pb-0
            border-b
            lg:border-b-0 lg:basis-1/3 lg:pr-4 lg:border-r
            xl:basis-1/3
            border-slate-900/10
            dark:border-slate-50/[0.06]
            energy:border-zinc-700/25
          "
        >
          <MainSectionSituationalAwareness />
        </div>
        <div
          class="
            py-4
            lg:py-0
            h-[425px]
            lg:h-full lg:basis-2/3
            xl:basis-2/3
            lg:px-4
          "
        >
          <template v-if="loadingArticles">
            <MainSectionHeadlineCard :loading="true" />
          </template>
          <template v-else>
            <MainSectionHeadlineCard :article="articles[0]" />
          </template>
        </div>
      </div>
      <!-- Main Section Featured Articles -->
      <div
        class="
          pt-4
          xl:basis-1/3 xl:pt-0
          border-t
          xl:border-t-0 xl:pl-4 xl:border-l
          border-slate-900/10
          dark:border-slate-50/[0.06]
          energy:border-zinc-700/25
        "
      >
        <div
          class="
            flex flex-col
            md:flex-row
            xl:flex-col
            h-full
            space-y-4
            md:space-y-0 md:space-x-4
            xl:space-y-4 xl:space-x-0
          "
        >
          <template v-if="loadingArticles">
            <template v-for="n in 2" :key="n">
              <router-link
                class="md:w-1/2 xl:w-full"
                :to="{ name: 'notFound' }"
              >
                <FeaturedArticleCard :loading="true" />
              </router-link>
            </template>
          </template>
          <template v-else>
            <template v-for="article in articles.slice(1, 3)" :key="article">
              <router-link
                class="md:w-1/2 xl:w-full"
                :to="{ name: 'article', params: { doc_num: article.doc_num } }"
              >
                <FeaturedArticleCard :article="article" />
              </router-link>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- Connected Articles Section -->
  <div
    class="
      pt-4
      pb-6
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <div class="font-semibold mb-4">Live Articles</div>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-if="loadingDanielArticles">
        <template v-for="n in 6" :key="n">
          <DanielArticleCard :loading="true" />
        </template>
      </template>
      <template v-else>
        <template v-for="article in danielArticles.slice(0, 6)" :key="article">
          <DanielArticleCard :article="article.attributes" />
        </template>
      </template>
    </div>
  </div>
  <!-- More (Featured) Articles Section -->
  <div
    class="
      pt-4
      pb-6
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <div class="font-semibold mb-4">More Articles</div>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-if="loadingArticles">
        <template v-for="n in 6" :key="n">
          <router-link :to="{ name: 'notFound' }">
            <FeaturedArticleCard :loading="true" />
          </router-link>
        </template>
      </template>
      <template v-else>
        <template v-for="article in articles.slice(3, 9)" :key="article">
          <router-link
            :to="{ name: 'article', params: { doc_num: article.doc_num } }"
          >
            <FeaturedArticleCard :article="article" />
          </router-link>
        </template>
      </template>
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
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import FeaturedArticleCard from "@/components/FeaturedArticleCard";
import DanielArticleCard from "@/components/DanielArticleCard";
import MainSectionSituationalAwareness from "@/components/MainSectionSituationalAwareness";
import MainSectionHeadlineCard from "@/components/MainSectionHeadlineCard";
import PersonalSection from "@/components/PersonalSection";
import { CalendarIcon } from "@heroicons/vue/outline";

const personalArticles = [
  {
    doc_num: 1,
    title: "(U) Moscow Lashes Out, Accusing West of Proxy War",
    summary:
      "(U) At a meeting of military leaders, the U.S. accelerated its drive to deter Russia’s offensive. Germany said it would send Ukraine heavy weapons for the first time.",
    tag1: "Russia",
    tag2: "Ukraine",
    date: "24 April 2022",
  },
  {
    doc_num: 2,
    title: "(U) Vice President Kamala Harris Tests Positive for Coronavirus",
    summary:
      "(U) Ms. Harris is the highest-ranking official in Washington to be infected. She has not had recent contact with President Biden, her office said. If you experience COVID19 symptoms, please get tested. She has not had recent contact with President Biden, her office said.",
    tag1: "COVID19",
    tag2: "C.D.C.",
    date: "23 April 2022",
  },
  {
    doc_num: 3,
    title:
      "(U) Coronavirus Has Infected Most Americans at Least Once, C.D.C. Says",
    summary:
      "(U) By February 2022, nearly 60 percent of the population had signs of exposure, almost double the proportion seen in December 2021, the agency’s data showed.",
    tag1: "COVID19",
    tag2: "C.D.C.",
    date: "22 April 2022",
  },
  {
    doc_num: 4,
    title: "(U) Moscow Lashes Out, Accusing West of Proxy War",
    summary:
      "(U) At a meeting of military leaders, the U.S. accelerated its drive to deter Russia’s offensive. Germany said it would send Ukraine heavy weapons for the first time.",
    tag1: "Russia",
    tag2: "Ukraine",
    date: "21 April 2022",
  },
  {
    doc_num: 5,
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
    FeaturedArticleCard,
    DanielArticleCard,
    MainSectionSituationalAwareness,
    MainSectionHeadlineCard,
    PersonalSection,
    CalendarIcon,
  },
  setup() {
    const store = useStore();
    const articles = computed(() => store.state.articles.featured);
    const loadingArticles = computed(() => store.state.articles.loading);
    const danielArticles = computed(() => store.state.daniel.articles);
    const loadingDanielArticles = computed(() => store.state.daniel.loading);
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));

    onMounted(() => {
      store.dispatch("articles/getHomeArticles");
      store.dispatch("daniel/getDanielArticles");
    });

    return {
      articles,
      loadingArticles,
      danielArticles,
      loadingDanielArticles,
      personalArticles,
      today,
    };
  },
};
</script>
