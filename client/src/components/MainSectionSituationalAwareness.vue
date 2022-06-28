<template>
  <div class="flex flex-col h-full">
    <div class="hidden lg:block font-semibold mb-4">Situational Awareness</div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="font-semibold">Situational Awareness</div>
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
      <div class="lg:flex flex-col justify-between text-sm">
        <template v-for="item in sitreps" :key="item">
          <div class="mb-4">
            <BaseCard class="px-4 py-4" :locked="item.locked">
              <div class="flex flex-col">
                <div class="flex items-center pb-1">
                  <template v-if="item.locked">
                    <LockClosedIcon
                      class="mr-2 h-4 w-4"
                      aria-hidden="true"
                    ></LockClosedIcon>
                  </template>
                  <span class="line-clamp-1">{{ item.title }}</span>
                </div>
                <div>{{ item.date }}</div>
              </div>
            </BaseCard>
          </div>
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
    <Carousel
      :settings="settings"
      :breakpoints="breakpoints"
      class="lg:hidden w-full"
    >
      <Slide v-for="item in sitreps" :key="item">
        <div class="pr-2 text-sm">
          <BaseCard
            class="w-[220px] rounded-md shadow-md px-4 py-2"
            :locked="item.locked"
          >
            <div class="flex flex-col text-left">
              <div class="flex items-center pb-1">
                <template v-if="item.locked">
                  <LockClosedIcon
                    class="mr-2 h-4 w-4"
                    aria-hidden="true"
                  ></LockClosedIcon> </template
                >{{ item.title }}
              </div>
              <div>{{ item.date }}</div>
            </div>
          </BaseCard>
        </div>
      </Slide>
      <template #addons>
        <Navigation
          class="
            invisible
            xl:visible
            bg-mission-blue
            text-mission-gray
            dark:bg-slate-300 dark:text-dark-navy
            energy:bg-gray-800 energy:text-gray-300
          "
        />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { LockClosedIcon } from "@heroicons/vue/outline";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import BaseCard from "@/components/base/BaseCard";

const sitreps = [
  {
    title: "(U) Sample SITREP TItle",
    date: "04/24/22, 0100 EDT",
    locked: false,
  },
  {
    title: "(U) Sample Threat TItle",
    date: "04/23/22, 0100 EDT",
    locked: true,
  },
  {
    title: "(U) Sample SITREP TItle",
    date: "04/22/22, 0100 EDT",
    locked: false,
  },
  {
    title: "(U) Sample Threat TItle",
    date: "04/21/22, 0100 EDT",
    locked: false,
  },
  {
    title: "(U) Sample SITREP TItle",
    date: "04/20/22, 0100 EDT",
    locked: true,
  },
];

// carousel settings
const settings = {
  itemsToShow: 1.75,
  snapAlign: "start",
};
// carousel breakpoints
const breakpoints = {
  //iPhone 12 Pro
  390: {
    itemsToShow: 1.5,
    snapAlign: "start",
  },
  //iPhone XR
  414: {
    itemsToShow: 1.65,
    snapAlign: "start",
  },
  //Custom Size
  500: {
    itemsToShow: 1.9,
    snapAlign: "start",
  },
  //Custom Size
  600: {
    itemsToShow: 2.25,
    snapAlign: "start",
  },
  //Custom Size
  700: {
    itemsToShow: 2.65,
    snapAlign: "start",
  },
  //Tailwind MD
  768: {
    itemsToShow: 2.85,
    snapAlign: "start",
  },
  //iPad Air
  820: {
    itemsToShow: 3.25,
    snapAlign: "start",
  },
  //Custom Size
  950: {
    itemsToShow: 3.75,
    snapAlign: "start",
  },
  //Custom Size
  1024: {
    itemsToShow: 4.25,
    snapAlign: "start",
  },
  //Custom Size
  1180: {
    itemsToShow: 4.75,
    snapAlign: "start",
  },
};

export default {
  components: {
    LockClosedIcon,
    Carousel,
    Slide,
    Navigation,
    BaseCard,
  },
  setup() {
    return {
      sitreps,
      settings,
      breakpoints,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
