<template>
  <div class="mb-4">
    <div class="hidden lg:block font-semibold mb-4">
      {{ title
      }}<span
        class="pl-2 text-sm font-light italic"
        title="This feature is not available yet."
        >(offline)</span
      >
    </div>
    <div class="flex lg:hidden justify-between mb-4">
      <div class="basis-3/4 font-semibold">
        {{ title
        }}<span
          class="pl-2 text-sm font-light italic"
          title="This feature is not available yet."
          >(offline)</span
        >
      </div>
      <div
        class="
          basis-1/4
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
        <PersonalSectionCard :article="items[index]" />
      </template>
    </div>
    <div
      class="
        hidden
        lg:block
        mt-2
        text-sm text-right
        hover:text-black
        dark:hover:text-white
        energy:hover:text-white
      "
    >
      More >
    </div>
    <Carousel :settings="settings" :breakpoints="breakpoints" class="lg:hidden">
      <Slide v-for="item in items" :key="item" class="p-2 pb-10">
        <PersonalSectionCard :article="item" :carousel="true" />
      </Slide>
    </Carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import PersonalSectionCard from "@/components/PersonalSectionCard.vue";

// carousel settings
const settings = {
  itemsToShow: 1.5,
  snapAlign: "start",
};

// carousel breakpoints
const breakpoints = {
  768: {
    itemsToShow: 2.5,
    snapAlign: "start",
  },
  1024: {
    itemsToShow: 0,
    snapAlign: "start",
  },
};

export default {
  components: {
    Carousel,
    Slide,
    PersonalSectionCard,
  },
  props: {
    title: String,
    items: Array,
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
.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>
