<template>
  <div
    class="
      flex flex-wrap
      justify-between
      p-4
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
        <template v-if="currentArticle() === 1">
          <BaseButton disabled>Previous</BaseButton>
        </template>
        <template v-else>
          <BaseButton
            @click="previousArticle"
            @keyup.enter="previousArticle"
            tabIndex="0"
          >
            Previous
          </BaseButton>
        </template>
      </div>
      <div class="hidden self-center truncate text-sm mr-2 md:block">
        Featured Article {{ currentArticle() }} of {{ danielArticles.length }}
      </div>
      <div class="self-center truncate text-sm mx-2 md:hidden">
        {{ currentArticle() }} of {{ danielArticles.length }}
      </div>
      <div>
        <template v-if="currentArticle() === danielArticles.length">
          <BaseButton disabled> Next </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            @click="nextArticle"
            @keyup.enter="nextArticle"
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
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
  props: ["selectedArticle"],
  setup() {
    const store = useStore();
    const danielArticles = computed(() => store.state.daniel.articles);

    onMounted(() => {
      store.dispatch("daniel/getDanielArticles");
    });
    return {
      danielArticles,
    };
  },
  methods: {
    currentArticle() {
      return this.danielArticles.indexOf(this.selectedArticle) + 1;
    },
    previousArticle() {
      const currentIndex = this.danielArticles.indexOf(this.selectedArticle);
      if (currentIndex > 0) {
        this.$router.push(
          `/article/${this.danielArticles[currentIndex - 1].doc_num}`
        );
      }
    },
    nextArticle() {
      const currentIndex = this.danielArticles.indexOf(this.selectedArticle);
      if (currentIndex < this.danielArticles.length - 1) {
        this.$router.push(
          `/article/${this.danielArticles[currentIndex + 1].doc_num}`
        );
      }
    },
    returnHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="scss"></style>
