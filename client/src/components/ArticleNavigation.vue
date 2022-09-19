<template>
  <div
    class="
      flex flex-wrap
      justify-between
      py-4
      mb-8
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    <div>
      <BaseButton @click="returnHome" @keyup.enter="returnHome" tabIndex="0">
        Home
      </BaseButton>
    </div>
    <div
      class="
        flex flex-wrap
        sm:absolute sm:space-x-4 sm:left-1/2 sm:-translate-x-1/2
      "
    >
      <div>
        <template v-if="currentArticleIndex === 1">
          <BaseButton disabled>Previous</BaseButton>
        </template>
        <template v-else>
          <BaseButton
            @click="goToPreviousArticle"
            @keyup.enter="goToPreviousArticle"
            tabIndex="0"
          >
            Previous
          </BaseButton>
        </template>
      </div>
      <div class="hidden self-center truncate text-sm mr-2 md:block">
        Featured Article {{ currentArticleIndex }} of
        {{ totalArticles.length }}
      </div>
      <div class="self-center truncate text-sm mx-2 md:hidden">
        {{ currentArticleIndex }} of {{ totalArticles.length }}
      </div>
      <div>
        <template v-if="currentArticleIndex === totalArticles.length">
          <BaseButton disabled> Next </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            @click="goToNextArticle"
            @keyup.enter="goToNextArticle"
            tabIndex="0"
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
  props: [
    "currentArticleIndex",
    "previousArticle",
    "nextArticle",
    "totalArticles",
  ],
  setup(props) {
    const router = useRouter();

    console.log("totalArticles: ", props.totalArticles);

    const returnHome = () => {
      router.push({ name: "home" });
    };

    const goToPreviousArticle = () => {
      let doc_num = props.previousArticle.attributes.doc_num;
      console.log("doc_num: ", doc_num);
      router.push({
        name: "article",
        params: {
          doc_num,
        },
      });
    };

    const goToNextArticle = () => {
      let doc_num = props.nextArticle.attributes.doc_num;
      console.log("doc_num: ", doc_num);
      router.push({
        name: "article",
        params: {
          doc_num,
        },
      });
    };

    return {
      returnHome,
      goToPreviousArticle,
      goToNextArticle,
    };
  },
};
</script>

<style lang="scss"></style>
