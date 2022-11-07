<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <p class="font-semibold text-2xl">
      {{ specialEdition.edition.name }}
    </p>
  </div>
  <div class="flex py-4">
    <div class="basis-2/3 grid grid-cols-1 lg:grid-cols-2 gap-4 px-2">
      <template
        v-for="article in specialEdition.edition.articles.concat(
          specialEdition.edition.restrictedArticles
        )"
        :key="article.id"
      >
        <BaseCard class="h-full" hoverable :rounded="false">
          <ArticleCard :article="article" />
        </BaseCard>
      </template>
    </div>
    <div class="basis-1/3">test 2</div>
  </div>
  <div>special edition {{ specialEdition }}</div>
</template>

<script>
import * as dayjs from "dayjs";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ArticleCard from "@/components/ArticleCard";

// import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    ArticleCard,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    //const router = useRouter();

    const loadingSpecialEdition = computed(
      () => store.state.specialEdition.loading
    );
    const specialEdition = computed(() => store.state.specialEdition);
    const currentPage = ref(parseInt(route.query.page) || 1);

    // const isLocked = (result) => {
    //   return !isEmpty(result.needed) || result.org_restricted;
    // };

    onMounted(() => {
      store.dispatch("specialEdition/getSpecialEdition");
    });

    watch(
      () => route.query,
      () => {
        console.log("route.query watcher triggered.");
        currentPage.value = parseInt(route.query.page) || 1;
        store.dispatch("specialEdition/getSpecialEdition");
      }
    );

    return {
      dayjs,
      loadingSpecialEdition,
      specialEdition,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
