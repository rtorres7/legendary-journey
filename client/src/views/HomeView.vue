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
      <div
        class="h-[39rem] md:h-full lg:pb-4 xl:pb-0 lg:flex xl:basis-2/3 lg:h-[37rem]"
      >
        <div
          class="pb-4 xl:pb-0 border-b lg:border-b-0 lg:basis-1/3 lg:pr-4 lg:border-r xl:basis-1/3 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
        >
          <MainSectionSituationalAwareness
            :sitreps="sitrepFeeds"
            :loading="loadingSitrepFeeds"
          />
        </div>
        <div
          class="py-4 lg:py-0 h-[425px] lg:h-full lg:basis-2/3 xl:basis-2/3 lg:pl-4 xl:pr-4"
        >
          <template v-if="loadingDanielArticles">
            <PublishedArticleCard loading headline />
          </template>
          <template v-else>
            <template v-if="danielArticles.length > 0">
              <router-link
                :to="{
                  name: 'article',
                  params: { doc_num: danielArticles[0].attributes.doc_num },
                }"
              >
                <PublishedArticleCard
                  :article="danielArticles[0].attributes"
                  headline
                />
              </router-link>
            </template>
            <template v-else>
              <div class="text-sm italic">
                No featured article was found. This could be due to access
                control or a network error.
              </div>
            </template>
          </template>
        </div>
      </div>
      <!-- Main Section Published Articles -->
      <div
        class="pt-4 xl:basis-1/3 xl:pt-0 border-t xl:border-t-0 xl:pl-4 xl:border-l border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
      >
        <!-- Only shows in screens smaller than XL -->
        <div class="block xl:hidden font-semibold mb-4">
          More Published Articles
        </div>
        <div
          class="flex flex-col md:flex-row xl:flex-col h-full space-y-4 md:space-y-0 md:space-x-4 xl:space-y-4 xl:space-x-0"
        >
          <template v-if="loadingDanielArticles">
            <template v-for="n in 2" :key="n">
              <div class="w-full h-[288px]">
                <PublishedArticleCard :loading="true" />
              </div>
            </template>
          </template>
          <template v-else>
            <template
              v-for="article in danielArticles.slice(1, 3)"
              :key="article"
            >
              <div class="w-full h-[288px] max-w-[591px]">
                <router-link
                  :to="{
                    name: 'article',
                    params: { doc_num: article.attributes.doc_num },
                  }"
                >
                  <PublishedArticleCard :article="article.attributes" />
                </router-link>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- More Published Articles Section (Large Screen Devices) -->
  <div class="xl:pt-4 pb-6">
    <div class="hidden xl:block font-semibold mb-4">
      More Published Articles
    </div>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
      <template v-if="loadingDanielArticles">
        <template v-for="n in 12" :key="n">
          <div class="w-full h-[264px]">
            <PublishedArticleCard loading />
          </div>
        </template>
      </template>
      <template v-else>
        <template v-if="danielArticles.length > 3">
          <template
            v-for="article in danielArticles.slice(3, 15)"
            :key="article"
          >
            <div class="w-full h-[264px]">
              <router-link
                :to="{
                  name: 'article',
                  params: { doc_num: article.attributes.doc_num },
                }"
              >
                <PublishedArticleCard :article="article.attributes" />
              </router-link>
            </div>
          </template>
        </template>
        <template v-else>
          <p class="hidden xl:block italic">
            No additional published articles were found.
          </p>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import PublishedArticleCard from "@/components/PublishedArticleCard";
import MainSectionSituationalAwareness from "@/components/MainSectionSituationalAwareness";

export default {
  components: {
    PublishedArticleCard,
    MainSectionSituationalAwareness,
  },
  setup() {
    const store = useStore();
    const danielArticles = computed(() => store.state.daniel.articles);
    const loadingDanielArticles = computed(() => store.state.daniel.loading);
    const sitrepFeeds = computed(() => store.state.feeds.sitreps);
    const loadingSitrepFeeds = computed(() => store.state.feeds.loading);
    const today = ref(dayjs().format("dddd, MMMM D, YYYY"));

    onMounted(() => {
      store.dispatch("daniel/getDanielArticles");
      store.dispatch("feeds/getSitrepFeeds");
    });

    return {
      danielArticles,
      loadingDanielArticles,
      loadingSitrepFeeds,
      sitrepFeeds,
      today,
    };
  },
};
</script>
