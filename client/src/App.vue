<template>
  <div
    ref="topOfApp"
    class="
      min-h-full
      bg-mission-blue
      dark:bg-dark-space-blue
      energy:bg-zinc-800
    "
    tabindex="-1"
  >
    <button class="skipLink" @click="skipToMain">
      Skip to main content
    </button>
    <TheBanner v-if="!['attachment'].includes($route.name)" />
    <main
      role="main"
      class="
        text-slate-900
        bg-gray-50
        dark:text-slate-300 dark:bg-dark-navy
        energy:text-zinc-300 energy:bg-zinc-900
      "
    >
      <!-- <div
        v-show="isLiveDemo"
        class="
          flex
          justify-center
          items-center
          bg-emerald-600/80
          p-2
          sticky
          z-10
          top-[101px]
        "
      >
        <p class="text-sm text-white">
          Note: This page is represents a live preview. The contents of this
          page are meant to showcase future capabilities and gather user
          feedback.
        </p>
      </div> -->
      <div
        ref="mainContent"
        class="
          max-w-8xl
          min-h-[80vh]
          md:min-h-[88vh]
          lg:min-h-[82vh]
          mx-auto
          py-3
          px-4
          sm:px-6
          lg:px-8
        "
        tabindex="-1"
      >
        <template v-if="loadingUser">
          <div class="max-w-fit m-auto mt-[30vh]">
            <BaseLoadingSpinner class="w-32 h-32" />
          </div>
        </template>
        <template v-else>
          <AuthorizatonWrapper>
            <router-view />
          </AuthorizatonWrapper>
        </template>
      </div>
    </main>
    <TheFooter v-if="!['attachment'].includes($route.name)" />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import AuthorizatonWrapper from "@/components/AuthorizationWrapper"
import TheBanner from "@/components/TheBanner";
import TheFooter from "@/components/TheFooter";
// import ScrollToTopBtn from "@/components/ScrollToTopBtn.vue";

export default {
  components: {
    AuthorizatonWrapper,
    TheBanner,
    TheFooter,
    // ScrollToTopBtn,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const topOfApp = ref(null);
    const mainContent = ref(null);
    const loadingUser = computed(() => store.state.user.loading);

    const isLiveDemo = computed(() => {
      return route.meta.demo ? true : false;
    });

    watch(useRoute(), () => {
      topOfApp.value.focus();
    });

    onMounted(() => {
      store.dispatch("user/loadUser");
      store.dispatch("metadata/loadMetadata");
      store.dispatch("specialEditions/loadConceptsLinks");

      document.documentElement.classList.remove(
        ...document.documentElement.classList
      );
      switch (localStorage.theme) {
        case "dark":
          document.documentElement.classList.add("dark");
          break;
        case "energy":
          document.documentElement.classList.add("energy");
          break;
        case "system":
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
          }
          break;
        default:
        //do nothing
      }
    });
    return {
      loadingUser,
      isLiveDemo,
      topOfApp,
      mainContent,
    };
  },
  methods: {
    skipToMain() {
      this.mainContent.focus();
    },
  },
};
</script>
<style lang="scss">
@use "~inter-ui/default" with
  ($inter-font-display: swap, $inter-font-path: "~inter-ui/Inter (web)");
@use "~inter-ui/variable" with
  ($inter-font-display: swap, $inter-font-path: "~inter-ui/Inter (web)");
@include default.all;
@include variable.all;

html {
  font-family: "Inter", "system-ui";
}

@supports (font-variation-settings: normal) {
  html {
    font-family: "Inter var", "system-ui";
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.skipLink {
  &:link,
  &:visited {
    color: black;
  }
  position: absolute;
  left: -9999px;
  top: 20px;
  z-index: 1000;
  &:active,
  &:focus {
    background: white;
    left: 20px;
    padding: 10px;
  }
}
</style>
