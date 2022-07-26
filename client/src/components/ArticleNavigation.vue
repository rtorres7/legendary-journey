<template>
  <div 
    class="
      flex
      flex-wrap
      justify-between
      p-4
      mb-8
      border-b-2
    "
  >
    <div>
      <router-link :to="{ name: 'home' }">
        <ArticleNavigationButton>
          <span class="sr-only">Home</span>
          Home
        </ArticleNavigationButton>
      </router-link>
    </div>
    <div class="flex flex-wrap sm:absolute sm:space-x-4 sm:left-1/2 sm:-translate-x-1/2">
      <div>
        <template v-if="currentArticle() === 1">
          <ArticleNavigationButton
            :disabled="true"
          >
            <span class="sr-only">Previous</span>
            Previous
          </ArticleNavigationButton>
        </template>
        <template v-else>
          <ArticleNavigationButton
            @click="previousArticle"
          >
            <span class="sr-only">Previous</span>
            Previous
          </ArticleNavigationButton>
        </template>
      </div>
      <div class="hidden self-center truncate text-sm mr-2 md:block">
        Featured Article {{ currentArticle() }} of {{ articles.length }}
      </div>
      <div class="self-center truncate text-sm mx-2 md:hidden">
        {{ currentArticle() }} of {{ articles.length }}
      </div>
      <div>
        <template v-if="currentArticle() === articles.length">
            <ArticleNavigationButton
              :disabled="true"
            >
              <span class="sr-only">Next</span>
              Next
            </ArticleNavigationButton>      
        </template>
        <template v-else>
          <ArticleNavigationButton
            @click="nextArticle"
          >
            <span class="sr-only">Next</span>
            Next
          </ArticleNavigationButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import ArticleNavigationButton from "./ArticleNavigationButton";

export default {
  components: {
    ArticleNavigationButton,
  },
  props: ["selectedArticle"],
  setup() {
    const store = useStore();
    const articles = computed(() => store.state.articles.featured);

    onMounted(() => {
      store.dispatch("articles/getHomeArticles");
    });
    return {
      articles,
    }
  },
  methods: {
    currentArticle() {
      return this.articles.indexOf(this.selectedArticle) + 1;
    },
    previousArticle() {
      const currentIndex = this.articles.indexOf(this.selectedArticle);
      if(currentIndex > 0) {
        this.$router.push(`/article/${this.articles[currentIndex - 1].id}`);
      }
    },
    nextArticle() {
      const currentIndex = this.articles.indexOf(this.selectedArticle);
      if(currentIndex < this.articles.length - 1) {
        this.$router.push(`/article/${this.articles[currentIndex + 1].id}`);
      }
    },
  },
}
</script>

<style lang="scss"></style>
