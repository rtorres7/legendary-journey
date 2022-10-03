<template>
  <div class="font-semibold mb-4">
    {{ title }}
  </div>
  <template v-if="loading">
    <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      <template v-for="n in 3" :key="n">
        <template v-if="n === 3">
          <div class="hidden xl:block w-full h-[236px]">
            <FeedItemCard loading />
          </div>
        </template>
        <template v-else>
          <div class="w-full h-[236px]">
            <FeedItemCard loading />
          </div>
        </template>
      </template>
    </div>
  </template>
  <template v-else>
    <template v-if="items.length > 0">
      <div class="hidden lg:grid xl:grid-cols-3 grid-cols-2 gap-6">
        <template v-for="(item, index) in items.length" :key="item">
          <FeedItemCard :feed="items[index]" />
        </template>
      </div>
      <Carousel
        :settings="settings"
        :breakpoints="breakpoints"
        class="lg:hidden"
      >
        <Slide v-for="item in items" :key="item" class="p-2">
          <FeedItemCard :feed="item" class="h-[236px]" />
        </Slide>
      </Carousel>
    </template>
    <template v-else>
      <p class="italic">No existing feed items were found.</p>
    </template>
  </template>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import FeedItemCard from "@/components/FeedItemCard";

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
    FeedItemCard,
  },
  props: {
    title: String,
    items: {
      type: Array,
      default: new Array(),
    },
    loading: Boolean,
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
