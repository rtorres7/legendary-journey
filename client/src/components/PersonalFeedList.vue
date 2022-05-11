<template>
  <!-- Because You Were Interested Section -->
  <!-- <PersonalSection
    :title="'Because you were interested in Ukraine and COVID19'"
    :items="articles"
  /> -->
  <div class="mb-4">
    <div class="hidden lg:block font-semibold mb-4">
      Because you were interested in Ukraine and COVID19
    </div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="basis-3/4 font-semibold">
        Because you were interested in Ukraine and COVID19
      </div>
      <div
        class="
          basis-1/4
          cursor-pointer
          text-sm text-right
          hover:text-black
          dark:hover:text-white
          energy:hover:text-white
        "
      >
        View More
      </div>
    </div>
    <div class="hidden lg:grid lg:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-for="(item, index) in 3" :key="item">
        <PersonalCard :article="articles[index]" />
      </template>
    </div>
    <div
      class="
        hidden
        lg:block
        mt-2
        cursor-pointer
        text-sm text-right
        hover:text-black
        dark:hover:text-white
        energy:hover:text-white
      "
    >
      More >
    </div>
    <Carousel :settings="settings" :breakpoints="breakpoints" class="lg:hidden">
      <Slide v-for="item in articles" :key="item" class="p-2 pb-10">
        <PersonalCard :article="item" :carousel="true" />
      </Slide>
    </Carousel>
  </div>
  <!-- Your Favorites -->
  <div class="mb-4">
    <div class="hidden lg:block font-semibold mb-4">Your Favorites</div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="basis-3/4 font-semibold">Your Favorites</div>
      <div
        class="
          basis-1/4
          cursor-pointer
          text-sm text-right
          hover:text-black
          dark:hover:text-white
          energy:hover:text-white
        "
      >
        View More
      </div>
    </div>
    <div class="hidden lg:grid lg:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-for="(item, index) in 3" :key="item">
        <PersonalCard :article="articles[index]" />
      </template>
    </div>
    <div
      class="
        hidden
        lg:block
        mt-2
        cursor-pointer
        text-sm text-right
        hover:text-black
        dark:hover:text-white
        energy:hover:text-white
      "
    >
      More >
    </div>
    <Carousel :settings="settings" :breakpoints="breakpoints" class="lg:hidden">
      <Slide v-for="item in articles" :key="item" class="p-2 pb-10">
        <PersonalCard :article="item" :carousel="true" />
      </Slide>
    </Carousel>
  </div>
  <!-- Recently Viewed -->
  <div class="mb-4">
    <div class="hidden lg:block font-semibold mb-4">Recently Viewed</div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="basis-3/4 font-semibold">Recently Viewed</div>
      <div
        class="
          basis-1/4
          cursor-pointer
          text-sm text-right
          hover:text-black
          dark:hover:text-white
          energy:hover:text-white
        "
      >
        View More
      </div>
    </div>
    <div class="hidden lg:grid lg:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-for="(item, index) in 3" :key="item">
        <PersonalCard :article="articles[index]" />
      </template>
    </div>
    <div
      class="
        hidden
        lg:block
        mt-2
        cursor-pointer
        text-sm text-right
        hover:text-black
        dark:hover:text-white
        energy:hover:text-white
      "
    >
      More >
    </div>
    <Carousel :settings="settings" :breakpoints="breakpoints" class="lg:hidden">
      <Slide v-for="item in articles" :key="item" class="p-2 pb-10">
        <PersonalCard :article="item" :carousel="true" />
      </Slide>
    </Carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import PersonalCard from "@/components/PersonalCard.vue";
//import PersonalSection from "@/components/PersonalSection.vue";

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
  name: "PersonalFeedList",
  components: {
    Carousel,
    Slide,
    PersonalCard,
    //PersonalSection,
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
