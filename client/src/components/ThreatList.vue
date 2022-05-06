<template>
  <div class="flex flex-col h-full">
    <div class="hidden lg:block font-semibold mb-4">Latest Threats</div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="font-semibold">Latest Threats</div>
      <div
        class="
          cursor-pointer
          text-sm
          hover:text-black
          dark:hover:text-white
          energy:hover:text-white
        "
      >
        View More
      </div>
    </div>
    <div class="hidden h-full lg:flex flex-col justify-between">
      <div class="flex flex-col">
        <template v-for="item in threats" :key="item">
          <ThreatCard :threat="item" class="mb-4" />
        </template>
      </div>
      <p
        class="
          text-sm text-right
          cursor-pointer
          hover:text-black
          dark:hover:text-white
          energy:hover:text-white
        "
      >
        More >
      </p>
    </div>
    <Carousel :settings="settings" :breakpoints="breakpoints" class="lg:hidden">
      <Slide v-for="item in threats" :key="item">
        <ThreatCard :threat="item" :carousel="true" />
      </Slide>
      <template #addons>
        <Navigation class="hidden" />
      </template>
    </Carousel>
  </div>
</template>
<script>
import { Carousel, Navigation, Slide } from "vue3-carousel";
import ThreatCard from "./threat/ThreatCard";

const threats = [
  {
    title:
      "(U) This is the sample Threat title for this locked threat card. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor.",
    date: "24 April 2022",
    locked: true,
  },
  {
    title:
      "(U) This is the sample Threat title for this threat card. Volutpat diam ut venenatis tellus in metus vulputate eu.",
    date: "22 April 2022",
    locked: false,
  },
  {
    title:
      "(U) This is the sample Threat title for this locked threat card. Eu scelerisque felis imperdiet proin fermentum leo vel orci porta.",
    date: "23 April 2022",
    locked: true,
  },
  // {
  //   title:
  //     "(U) Volutpat diam ut venenatis tellus in metus vulputate eu. Orci phasellus egestas tellus rutrum tellus.",
  //   date: "22 April 2022",
  //   locked: false,
  // },
  // {
  //   title:
  //     "(U) Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Aliquet lectus proin nibh nisl condimentum id venenatis.",
  //   date: "21 April 2022",
  //   locked: false,
  // },
  // {
  //   title:
  //     "(U) Quisque non tellus orci ac auctor augue. Amet massa vitae tortor condimentum lacinia quis vel eros.",
  //   date: "20 April 2022",
  //   locked: true,
  // },
  // {
  //   title:
  //     "(U) Tempor id eu nisl nunc mi. Diam maecenas sed enim ut sem viverra aliquet eget sit.",
  //   date: "19 April 2022",
  //   locked: false,
  // },
];

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
    ThreatCard,
  },
  setup() {
    //
    return {
      threats,
    };
  },
  data: () => ({
    // carousel settings
    settings: {
      itemsToShow: 1.25,
      snapAlign: "start",
    },
    breakpoints: {
      //iPhone XR
      414: {
        itemsToShow: 1.3,
        snapAlign: "start",
      },
      //Custom Size
      500: {
        itemsToShow: 1.5,
        snapAlign: "start",
      },
      //Custom Size
      600: {
        itemsToShow: 1.9,
        snapAlign: "start",
      },
      //Tailwind MD
      768: {
        itemsToShow: 2.5,
        snapAlign: "start",
      },
      //iPad Air
      820: {
        itemsToShow: 2.65,
        snapAlign: "start",
      },
      //Custom Size
      950: {
        itemsToShow: 3.15,
        snapAlign: "start",
      },
    },
  }),
};
</script>
<style lang="scss">
.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>
