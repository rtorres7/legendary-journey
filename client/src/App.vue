<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-100">
    <body class="h-full">
    ```
  -->
  <div class="min-h-full">
    <AppBanner />
    <main
      class="
        text-slate-800
        bg-mission-gray
        dark:text-slate-300 dark:bg-dark-navy
        energy:text-gray-300 energy:bg-gray-900
      "
    >
      <div class="max-w-8xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppBanner from "@/components/application/AppBanner.vue";
import AppFooter from "@/components/application/AppFooter.vue";
// import ScrollToTopBtn from "@/components/ScrollToTopBtn.vue";

export default {
  components: {
    AppBanner,
    AppFooter,
    // ScrollToTopBtn,
  },
  setup() {
    return {};
  },
  mounted() {
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
</style>