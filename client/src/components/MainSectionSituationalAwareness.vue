<template>
  <div class="flex flex-col h-full">
    <div class="hidden lg:block font-semibold mb-4">Situational Awareness</div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="font-semibold">Situational Awareness</div>
      <div
        class="text-sm hover:text-black dark:hover:text-white energy:hover:text-white"
      >
        <router-link to="search?text=&product_types[]=10377">
          View More
        </router-link>
      </div>
    </div>
    <div class="hidden h-full lg:flex flex-col space-y-2 justify-between">
      <div class="lg:flex flex-col space-y-4 justify-between">
        <template v-if="loading">
          <template v-for="n in 3" :key="n">
            <div class="w-full h-40">
              <SituationalAwarenessCard loading />
            </div>
          </template>
        </template>
        <template v-else>
          <template v-if="sitreps.length > 0">
            <template v-for="item in sitreps" :key="item">
              <div class="w-full h-40">
                <router-link
                  :to="{ name: 'article', params: { doc_num: item.doc_num } }"
                >
                  <SituationalAwarenessCard :sitrep="item" />
                </router-link>
              </div>
            </template>
          </template>
          <template v-else> No Daily Briefs were found.</template>
        </template>
      </div>
      <p
        class="text-sm text-right hover:text-black dark:hover:text-white energy:hover:text-white"
      >
        <router-link to="search?text=&product_types[]=10377">
          More >
        </router-link>
      </p>
    </div>
    <Carousel
      :settings="settings"
      :breakpoints="breakpoints"
      class="lg:hidden w-full"
    >
      <template v-if="loading">
        <Slide v-for="n in 3" :key="n">
          <div class="w-[280px] h-36 mr-4">
            <SituationalAwarenessCard loading />
          </div>
        </Slide>
      </template>
      <template v-else>
        <Slide v-for="item in sitreps" :key="item">
          <div class="w-full h-36 text-left mr-4">
            <router-link
              :to="{ name: 'article', params: { doc_num: item.doc_num } }"
            >
              <SituationalAwarenessCard :sitrep="item" />
            </router-link>
          </div>
        </Slide>
      </template>
      <template #addons>
        <Navigation
          v-if="!loading"
          class="bg-mission-blue text-mission-gray hover:text-mission-gray dark:bg-slate-300 dark:text-dark-navy dark:hover:text-dark-navy energy:bg-zinc-300 energy:text-zinc-700 energy:hover:text-zinc-700"
        />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { Carousel, Navigation, Slide } from "vue3-carousel";
import SituationalAwarenessCard from "@/components/SituationalAwarenessCard";

const settings = {
  itemsToShow: 1.75,
  snapAlign: "start",
};
const breakpoints = {
  //Tailwind MD
  768: {
    itemsToShow: 3,
    snapAlign: "start",
  },
};
export default {
  components: {
    Carousel,
    Slide,
    Navigation,
    SituationalAwarenessCard,
  },
  props: {
    sitreps: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {
      settings,
      breakpoints,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
