<template>
  <div class="flex text-sm py-4">
    <p class="pr-3">
      {{ today }}
    </p>
  </div>
  <!-- Main Section -->
  <div
    class="py-4 xl:border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50"
  >
    <div
      class="flex flex-col lg:block xl:flex xl:flex-row xl:max-h-max h-full xl:h-[37rem]"
    >
      <!-- Main Section Sit. Awareness & Headline Container -->
      <div class="md:h-full lg:pb-4 xl:pb-0 lg:flex xl:w-2/3 lg:h-[37rem]">
        <div
          class="pb-4 xl:pb-0 border-b lg:border-b-0 lg:w-1/3 lg:pr-4 lg:border-r xl:w-1/3 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
        >
          <div class="flex flex-col h-full">
            <div class="hidden lg:block font-semibold mb-4">
              Situational Awareness
            </div>
            <div class="flex lg:hidden justify-between mb-4">
              <div class="font-semibold">Situational Awareness</div>
              <div
                class="text-sm hover:text-black dark:hover:text-white energy:hover:text-white"
              >
                <router-link
                  to="search?text=&product_types[]=10377&product_types[]=10379&product_types[]=10380&product_types[]=10384&product_types[]=10385&product_types[]=10386&product_types[]=10382&product_types[]=10383"
                >
                  View More
                </router-link>
              </div>
            </div>
            <div
              class="hidden h-full lg:flex flex-col space-y-2 justify-between"
            >
              <div class="lg:flex flex-col space-y-4 justify-between">
                <template v-if="loadingFeaturedContent">
                  <template v-for="n in 3" :key="n">
                    <div class="w-full h-40">
                      <SituationalAwarenessCard loading />
                    </div>
                  </template>
                </template>
                <template v-else>
                  <template v-if="briefs.length > 0">
                    <template v-for="item in briefs" :key="item">
                      <div class="w-full h-40">
                        <SituationalAwarenessCard :sitrep="item" />
                      </div>
                    </template>
                  </template>
                  <template v-else
                    ><p class="text-sm italic">
                      No Daily Briefs were found.
                    </p></template
                  >
                </template>
              </div>
              <p
                class="text-sm text-right hover:text-black dark:hover:text-white energy:hover:text-white"
              >
                <router-link
                  to="search?text=&product_types[]=10377&product_types[]=10379&product_types[]=10380&product_types[]=10384&product_types[]=10385&product_types[]=10386&product_types[]=10382&product_types[]=10383"
                >
                  View More
                </router-link>
              </p>
            </div>
            <Carousel
              :settings="carouselSettings"
              :breakpoints="carouselBreakpoints"
              class="lg:hidden w-full"
            >
              <template v-if="loadingFeaturedContent">
                <Slide v-for="n in 3" :key="n">
                  <div class="w-[280px] h-36 mr-4">
                    <SituationalAwarenessCard loading />
                  </div>
                </Slide>
              </template>
              <template v-else>
                <Slide v-for="item in briefs" :key="item">
                  <div class="w-full h-36 text-left mr-4">
                    <SituationalAwarenessCard :sitrep="item" />
                  </div>
                </Slide>
              </template>
              <template #addons>
                <Navigation
                  v-if="!loadingFeaturedContent && briefs.length > 0"
                  class="bg-mission-blue text-mission-gray hover:text-mission-gray dark:bg-slate-300 dark:text-slate-900 dark:hover:text-slate-900 energy:bg-zinc-300 energy:text-zinc-700 energy:hover:text-zinc-700"
                />
              </template>
            </Carousel>
            <template v-if="!loadingFeaturedContent && briefs.length === 0">
              <p class="lg:hidden text-sm italic">
                No Daily Briefs were found.
              </p>
            </template>
          </div>
        </div>
        <div
          class="py-4 lg:py-0 h-[475px] md:h-[600px] lg:h-full lg:w-2/3 xl:w-2/3 lg:pl-4 xl:pr-4"
        >
          <template v-if="loadingFeaturedContent">
            <PublishedProductCard loading headline />
          </template>
          <template v-else>
            <template v-if="features.length > 0">
              <PublishedProductCard :product="features[0]" headline />
            </template>
            <template v-else>
              <div class="text-sm italic">
                No featured product was found. This could be due to access
                control or a network error.
              </div>
            </template>
          </template>
        </div>
      </div>
      <!-- Main Section Published Products -->
      <div
        class="pt-4 xl:w-1/3 xl:pt-0 border-t xl:border-t-0 xl:pl-4 xl:border-l border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
      >
        <!-- Only shows in screens smaller than XL -->
        <div class="block xl:hidden font-semibold mb-4">
          More Published Products
        </div>
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-between h-full space-y-4 md:space-y-0 md:space-x-4 xl:space-y-4 xl:space-x-0"
        >
          <template v-if="loadingFeaturedContent">
            <template v-for="n in 2" :key="n">
              <div class="w-full h-[288px] md:max-w-[575px]">
                <PublishedProductCard :loading="true" />
              </div>
            </template>
          </template>
          <template v-else>
            <template v-for="product in features.slice(1, 3)" :key="product">
              <div class="w-full h-[288px] md:max-w-[575px]">
                <PublishedProductCard :product="product" />
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- More Published Products Section (Large Screen Devices) -->
  <div class="xl:pt-4 pb-6">
    <div class="hidden xl:block font-semibold mb-4">
      More Published Products
    </div>
    <!-- TODO: There's a small gap here when going from XL to LG media screen that needs to be addressed. -->
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-if="loadingFeaturedContent">
        <template v-for="n in 12" :key="n">
          <div class="w-full h-[288px] md:max-w-[575px]">
            <PublishedProductCard loading />
          </div>
        </template>
      </template>
      <template v-else>
        <template v-if="features.length > 3">
          <template v-for="product in features.slice(3, 15)" :key="product">
            <div class="w-full h-[288px] md:max-w-[575px]">
              <PublishedProductCard :product="product" />
            </div>
          </template>
        </template>
        <template v-else>
          <p class="hidden xl:block italic">
            No additional published products were found.
          </p>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs/esm/index.js";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import PublishedProductCard from "@current/components/PublishedProductCard.vue";
import SituationalAwarenessCard from "@current/components/SituationalAwarenessCard.vue";

const carouselSettings = {
  itemsToShow: 1.75,
  snapAlign: "start",
};
const carouselBreakpoints = {
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
    PublishedProductCard,
    SituationalAwarenessCard,
  },
  setup() {
    const store = useStore();
    const loadingFeaturedContent = computed(() => store.state.features.loading);
    const features = computed(() => store.state.features.features);
    const briefs = computed(() => store.state.features.briefs);
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));

    onMounted(() => {
      store.dispatch("features/loadFeaturedContent");
    });

    return {
      carouselSettings,
      carouselBreakpoints,
      features,
      loadingFeaturedContent,
      briefs,
      today,
    };
  },
};
</script>
