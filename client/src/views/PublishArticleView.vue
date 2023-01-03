<template>
  <div
    class="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="flex flex-col space-y-4">
      <h1 class="font-semibold text-2xl">Publish an Article</h1>
      <h2>Get started by selecting from the following options.</h2>
    </div>
    <BaseDatepicker
      v-model="selectedDate"
      class="w-fit h-fit"
      :enable-time-picker="false"
      :disabled-week-days="[6, 0]"
      week-start="0"
      auto-apply
      @update:modelValue="selectDate"
    >
      <template #trigger>
        <BaseCard class="p-2 cursor-pointer">
          <div class="flex items-center">
            <CalendarIcon
              class="hover:text-black dark:hover:text-white energy:hover:text-white h-6 w-6"
            />
            <span class="pl-2 text-lg">
              {{ routeDate }}
            </span>
          </div>
        </BaseCard>
      </template>
    </BaseDatepicker>
  </div>
  <div
    class="py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="flex space-x-2 items-center">
      <a class="font-semibold cursor-pointer" @click="goToNewArticle">
        Create a New Article
      </a>
      <ArrowRightIcon class="h-5 w-5" />
    </div>
    <p class="text-sm">Starting from scratch? Start here.</p>
  </div>
  <template v-if="loadingArticles">
    <div class="max-w-fit m-auto mt-[20vh]">
      <svg
        class="animate-spin -ml-1 mr-3 h-24 w-24 text-mission-blue dark:text-slate-300 energy:text-zinc-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </template>
  <template v-else>
    <div class="py-6">
      <h3 class="font-semibold pb-4">
        Edit Existing Articles ({{ articles.length }})
      </h3>
      <template v-if="articles.length > 0">
        <BaseCard>
          <template v-for="{ attributes: article } in articles" :key="article">
            <div
              class="flex p-4 justify-between border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-50/[0.06]"
            >
              <div class="flex px-2">
                <div class="pr-4">
                  <ArticleImage
                    class="h-[125px] w-[125px]"
                    :article="article"
                  />
                </div>
                <div>
                  <router-link
                    :to="{
                      name:
                        article.state === 'draft'
                          ? 'article-preview'
                          : 'article',
                      params: { doc_num: article.doc_num },
                    }"
                  >
                    <h4
                      class="line-clamp-4 md:line-clamp-3 lg:line-clamp-2 hover:underline break-words"
                    >
                      {{
                        article.title_classif
                          ? `(${article.title_classif})`
                          : ""
                      }}
                      {{ article.title }}
                    </h4>
                  </router-link>
                  <div class="text-sm break-all">
                    <p
                      class="py-2 uppercase text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80"
                    >
                      {{ dayjs(article.date_published).format("D MMM") }} -
                      {{ article.reporting_type_display_name }} |
                      {{ article.doc_num }}
                    </p>
                    <p class="line-clamp-3 md:line-clamp-2 break-all">
                      {{
                        article.summary_classif
                          ? `(${article.summary_classif})`
                          : ""
                      }}
                      {{ article.summary }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex pl-2">
                <p
                  :class="[
                    'min-w-[100px] capitalize pr-4',
                    article.state === 'draft'
                      ? 'text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow'
                      : 'italic text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80',
                  ]"
                >
                  {{ article.state }}
                </p>
                <router-link
                  :to="{
                    name: 'edit',
                    params: {
                      date: routeDate,
                      id: article.id,
                      doc_num: article.doc_num,
                    },
                  }"
                >
                  <PencilIcon class="h-5 w-5" />
                </router-link>
              </div>
            </div>
          </template>
        </BaseCard>
      </template>
      <template v-else>
        <p class="pt-2 italic">No articles found.</p>
      </template>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "@/config/wireAxios";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  ArrowRightIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/vue/24/outline";
import ArticleImage from "@/components/ArticleImage";

export default {
  components: {
    ArrowRightIcon,
    CalendarIcon,
    PencilIcon,
    ArticleImage,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const routeDate = computed(() => route.params.date);
    const selectedDate = ref();

    const goToNewArticle = () => {
      if (process.env.NODE_ENV === "low") {
        router.push({
          name: "edit",
          params: {
            date: route.params.date,
            id: 25,
            doc_num: "WIReWIRe_sample_6",
          },
        });
      } else {
        axios
          .post("/articles/processDocument", {
            analysis_type_id: 5,
            classification_xml: "",
            document_action: "create",
            html_body: "<p></p>",
            producing_office: "DNI/NCTC",
            poc_info:
              "NCTC/DI Managing Editor, 932-4533 (secure), (571) 280-3627 (open)",
            publication_number: Math.floor(100000 * Math.random() * 900000),
            title: "Draft Document Title",
            topics: ["TERR"],
            wire_id: route.params.date,
          })
          .then((response) => {
            console.log("/articles/processDocument :", response);
            router.push({
              name: "edit",
              params: {
                date: route.params.date,
                id: response.data.article.id,
                doc_num: response.data.doc_num,
              },
            });
          });
      }
    };

    const selectDate = () => {
      const date = dayjs(selectedDate.value).format("YYYY-MM-DD");
      router.push({ name: "publish", params: { date } });
    };

    const articles = computed(() => store.state.wires.articles);
    const loadingArticles = computed(() => store.state.wires.loading);

    onMounted(() => {
      store.dispatch("wires/getWireByDate", route.params.date);
      selectedDate.value = dayjs(route.params.date).toDate();
    });

    watch(
      () => route.query,
      () => {
        if (route.name === "publish") {
          store.dispatch("wires/getWireByDate", route.params.date);
          selectedDate.value = dayjs(route.params.date).toDate();
        }
      }
    );

    return {
      goToNewArticle,
      selectedDate,
      routeDate,
      selectDate,
      articles,
      loadingArticles,
      dayjs,
    };
  },
};
</script>

<style scoped lang="scss"></style>
