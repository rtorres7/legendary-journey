<template>
  <div class="flex flex-col h-full">
    <div class="hidden lg:block font-semibold mb-4">
      Situational Awareness<span
        class="pl-2 text-sm font-light italic"
        title="This feature is not available yet."
        >(offline)</span
      >
    </div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="font-semibold">
        Situational Awareness<span
          class="pl-2 text-sm font-light italic"
          title="This feature is not available yet."
          >(offline)</span
        >
      </div>
      <div
        class="
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
      <div class="lg:flex flex-col justify-between">
        <template v-for="item in sitreps" :key="item">
          <div class="mb-4">
            <BaseCard
              class="h-36 px-4 py-4"
              :locked="item.locked"
              hoverable
              :rounded="false"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <div class="flex items-center text-sm mb-2">
                    <template v-if="item.locked">
                      <LockClosedIcon
                        class="mr-2 h-4 w-4"
                        aria-hidden="true"
                      ></LockClosedIcon>
                    </template>
                    <span class="line-clamp-2">{{ item.type }}</span>
                  </div>
                  <div class="line-clamp-2 font-medium">{{ item.title }}</div>
                </div>
                <div
                  class="
                    text-slate-600
                    dark:text-slate-400
                    energy:text-zinc-400
                    text-sm
                  "
                >
                  Posted {{ item.date }}
                </div>
              </div>
            </BaseCard>
          </div>
        </template>
      </div>
      <p
        class="
          text-sm text-right
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
            hoverable
          >
            <div class="flex flex-col text-left">
              <div class="flex items-center pb-1">
                <template v-if="item.locked">
                  <LockClosedIcon
                    class="mr-2 h-4 w-4"
                    aria-hidden="true"
                  ></LockClosedIcon>
                </template>
                <span class="line-clamp-1 font-medium">{{ item.title }}</span>
              </div>
              <div>Posted {{ item.date }}</div>
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
            energy:bg-zinc-800 energy:text-zinc-300
          "
        />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { LockClosedIcon } from "@heroicons/vue/solid";
import { Carousel, Navigation, Slide } from "vue3-carousel";

const sitreps = [
  {
    title: "(U) Latest Sample SITREP Publication Heading",
    type: "SITREP",
    date: "yesterday",
    locked: false,
  },
  {
    title: "(U) Latest Sample Threat Publication Heading",
    type: "Threat",
    date: "2 days ago",
    locked: true,
  },
  {
    title: "(U) Another Sample SITREP Publication Heading #2",
    type: "SITREP",
    date: "1 week ago",
    locked: false,
  },
  // {
  //   title: "(U) Sample Threat Title",
  //   date: "04/21/22, 0100 EDT",
  //   locked: false,
  // },
  // {
  //   title: "(U) Sample SITREP Title",
  //   date: "04/20/22, 0100 EDT",
  //   locked: true,
  // },
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
