<template>
  <template v-if="domain === 'current'">
    <CurrentShell />
  </template>
  <template v-if="domain === 'workspace'">
    <main role="main" class="bg-white text-gray-900">
      <router-view />
    </main>
  </template>
  <template v-if="domain === 'studio'">
    <main role="main" class="bg-white text-gray-900">
      <StudioShell />
    </main>
  </template>
</template>

<script>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import CurrentShell from "@current/DomainShell.vue";
import StudioShell from "@studio/DomainShell.vue";

export default {
  components: {
    CurrentShell,
    StudioShell,
  },
  setup() {
    const route = useRoute();

    const domain = computed(() => route.meta.domain);

    onMounted(() => {
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
      domain,
    };
  },
};
</script>
<style lang="scss">
@use "~inter-ui/default" with (
  $inter-font-display: swap,
  $inter-font-path: "~inter-ui/Inter (web)"
);
@use "~inter-ui/variable" with (
  $inter-font-display: swap,
  $inter-font-path: "~inter-ui/Inter (web)"
);
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
</style>
