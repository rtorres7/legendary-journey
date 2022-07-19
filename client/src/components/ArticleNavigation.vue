<template>
  <div 
    class="
      flex
      p-2
      mb-8
      border-t-2
      border-slate-900/10
      dark:border-slate-300/50
      energy:border-gray-300/50      
      bg-slate-200
      dark:bg-slate-800
      energy:bg-gray-800
    "
  >
    <router-link :to="{ name: 'home' }">
      <div>
          <button
            type="button"
            class="
              hidden md:block
              border-2
              border-slate-900/20
              bg-gray-50
              py-1
              px-4
              text-xs
              rounded
              shadow
              hover:bg-gray-200 hover:shadow
              dark:hover:bg-slate-400 dark:hover:shadow
              energy:hover:bg-gray-400 energy:hover:shadow        
              transition
              duration-150
              ease-in-out
              dark:text-dark-navy
              dark:bg-slate-300
              energy:text-gray-900
              energy:bg-gray-300    
            "
          >
            <span class="sr-only">Return to list of articles</span>
            &lt; Return to List
          </button>
      </div>
      <div>
        <button
          type="button"
          class="
            md:hidden
            border-2
            border-slate-900/20
            bg-gray-50
            py-1
            px-4
            text-xs
            rounded
            shadow
            hover:bg-gray-200 hover:shadow
            dark:hover:bg-slate-400 dark:hover:shadow
            energy:hover:bg-gray-400 energy:hover:shadow        
            transition
            duration-150
            ease-in-out
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300    
          "
        >
          <span class="sr-only">Return to list of articles</span>
          <ViewListIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </router-link>
    <div class="flex justify-center absolute left-1/2 -translate-x-1/2">
      <div>
        <button
          type="button"
          class="
            hidden md:block
            border-2
            border-slate-900/20
            bg-gray-50
            py-1
            px-4
            mr-1
            sm:mr-8
            text-xs
            rounded
            shadow
            hover:bg-gray-200 hover:shadow
            dark:hover:bg-slate-400 dark:hover:shadow
            energy:hover:bg-gray-400 energy:hover:shadow
            transition
            duration-150
            ease-in-out
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300        
          "
          @click="previousArticle"
        >
          <span class="sr-only">Previous article</span>
          &lt; Previous
        </button>
      </div>
      <div>
        <button
          type="button"
          class="
            md:hidden
            border-2
            border-slate-900/20
            bg-gray-50
            py-1
            px-4
            mr-1
            sm:mr-8
            text-xs
            rounded
            shadow
            hover:bg-gray-200 hover:shadow
            dark:hover:bg-slate-400 dark:hover:shadow
            energy:hover:bg-gray-400 energy:hover:shadow
            transition
            duration-150
            ease-in-out
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300        
          "
          @click="previousArticle"
        >
          <span class="sr-only">Previous article</span>
          <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden sm:block text-xs lg:text-base self-center text-center truncate">
        Featured Articles ({{ currentArticle() }} of {{ articles.length }})
      </div>
      <div>
        <button
          type="button"
          class="
            hidden md:block
            border-2
            border-slate-900/20
            bg-gray-50
            py-1
            px-4
            ml-1
            sm:ml-8
            text-xs
            rounded
            shadow
            hover:bg-gray-200 hover:shadow
            dark:hover:bg-slate-400 dark:hover:shadow
            energy:hover:bg-gray-400 energy:hover:shadow
            transition
            duration-150
            ease-in-out
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300        
          "
          @click="nextArticle"
        >
          <span class="sr-only">Next article</span>
          Next &gt;
        </button>
      </div>
      <div>
        <button
          type="button"
          class="
            md:hidden
            border-2
            border-slate-900/20
            bg-gray-50
            py-1
            px-4
            ml-1
            sm:ml-8
            text-xs
            rounded
            shadow
            hover:bg-gray-200 hover:shadow
            dark:hover:bg-slate-400 dark:hover:shadow
            energy:hover:bg-gray-400 energy:hover:shadow
            transition
            duration-150
            ease-in-out
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300        
          "
          @click="nextArticle"
        >
          <span class="sr-only">Next article</span>
          <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import {
  ViewListIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/vue/outline";

export default {
  components: {
    ViewListIcon,
    ChevronLeftIcon,
    ChevronRightIcon
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
      else {
        this.disableButton();
      }
    },
    nextArticle() {
      const currentIndex = this.articles.indexOf(this.selectedArticle);
      if(currentIndex < this.articles.length - 1) {
        this.$router.push(`/article/${this.articles[currentIndex + 1].id}`);
      }
    },
    disableButton() {
      this.disabled = true;
    }
  }
}
</script>

<style lang="scss"></style>
