<template>
  <!-- Because You Were Interested Section -->
  <PersonalSection
    :title="'Because you were interested in Ukraine and COVID19'"
    :items="articles"
  />
  <!-- Your Favorites -->
  <PersonalSection :title="'Your Favorites'" :items="articles" />
  <!-- Recently Viewed -->
  <PersonalSection :title="'Recently Viewed'" :items="articles" />
</template>

<script>
import PersonalSection from "./PersonalSection.vue";

const articles = [
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
  name: "PersonalFeed",
  components: {
    PersonalSection,
  },
  setup() {
    return {
      articles,
    };
  },
  data: () => ({
    // carousel settings
    settings: {
      itemsToShow: 1.5,
      snapAlign: "start",
    },
    breakpoints: {
      768: {
        itemsToShow: 2.5,
        snapAlign: "start",
      },
      1024: {
        itemsToShow: 0,
        snapAlign: "start",
      },
    },
  }),
};
</script>

<style scoped lang="scss">
.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>
