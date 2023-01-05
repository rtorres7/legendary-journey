<template>
  <div
    class="no-print flex flex-wrap justify-between py-4 mb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25"
  >
    <div>
      <BaseButton tabIndex="0" @click="returnHome" @keyup.enter="returnHome">
        Home
      </BaseButton>
    </div>
    <div
      class="flex flex-wrap sm:absolute sm:space-x-4 sm:left-1/2 sm:-translate-x-1/2"
    >
      <div>
        <template v-if="!navigation.previousArticle">
          <BaseButton disabled> Previous </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            tabIndex="0"
            @click="goToArticle(navigation.previousArticle)"
            @keyup.enter="goToArticle(navigation.previousArticle)"
          >
            Previous
          </BaseButton>
        </template>
      </div>
      <div class="hidden self-center truncate text-sm mr-2 md:block">
        Featured Article {{ navigation.currentArticle.position }} of
        {{ navigation.totalArticles }}
      </div>
      <div class="self-center truncate text-sm mx-2 md:hidden">
        {{ navigation.currentArticle.position }} of
        {{ navigation.totalArticles }}
      </div>
      <div>
        <template v-if="!navigation.nextArticle">
          <BaseButton disabled> Next </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            tabIndex="0"
            @click="goToArticle(navigation.nextArticle)"
            @keyup.enter="goToArticle(navigation.nextArticle)"
          >
            Next
          </BaseButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: {
    navigation: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const returnHome = () => {
      router.push({ name: "home" });
    };

    const goToArticle = ({ doc_num }) => {
      router.push({
        name: "article",
        params: {
          doc_num,
        },
      });
    };

    return {
      returnHome,
      goToArticle,
    };
  },
};
</script>

<style lang="scss"></style>
