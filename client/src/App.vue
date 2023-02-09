<template>
  <div
    ref="topOfApp"
    class="min-h-full bg-mission-blue dark:bg-dark-space-blue energy:bg-zinc-800"
    tabindex="-1"
  >
    <button class="skipLink" @click="skipToMain">Skip to main content</button>
    <TheBanner v-if="!['attachment'].includes($route.name)" />
    <main
      role="main"
      class="text-slate-900 bg-slate-100 dark:text-slate-300 dark:bg-dark-navy energy:text-zinc-300 energy:bg-zinc-900"
    >
      <div
        ref="mainContent"
        class="max-w-8xl min-h-[80vh] md:min-h-[88vh] lg:min-h-[65vh] mx-auto py-3 px-4 sm:px-6 lg:px-8"
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
          <ScrollToTopButton />
        </template>
      </div>
    </main>
    <TheFooter v-if="!['attachment'].includes($route.name)" />
    <transition-group
      name="toast-notification"
      tag="div"
      class="z-[100] fixed top-2 right-2 flex flex-col-reverse gap-3"
      @before-enter="stopBodyOverflow"
      @after-enter="allowBodyOverflow"
      @before-leave="stopBodyOverflow"
      @after-leave="allowBodyOverflow"
    >
      <ToastNotification
        v-for="item in notifications"
        :id="item.id"
        :key="item.id"
        :type="item.type"
        :title="item.title"
        :message="item.message"
        :auto-close="item.autoClose"
        :can-close="item.canClose"
        :duration="item.duration"
        @close="
          () => {
            removeNotifications(item.id);
          }
        "
      />
    </transition-group>
  </div>
</template>

<script>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import useNotifications from "@/composables/notifications";
import AuthorizatonWrapper from "@/components/AuthorizationWrapper";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TheBanner from "@/components/TheBanner";
import TheFooter from "@/components/TheFooter";
import ToastNotification from "@/components/ToastNotification";

export default {
  components: {
    AuthorizatonWrapper,
    ScrollToTopButton,
    TheBanner,
    TheFooter,
    ToastNotification,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const topOfApp = ref(null);
    const mainContent = ref(null);
    const loadingUser = computed(() => store.state.user.loading);

    const {
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    } = useNotifications();

    provide("create-notification", createNotification);

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

    const skipToMain = () => {
      mainContent.value.focus();
    };

    return {
      loadingUser,
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
      isLiveDemo,
      topOfApp,
      mainContent,
      skipToMain,
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

@media print {
  .no-print,
  .no-print * {
    display: none !important;
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
.toast-notification-enter-active {
  animation: toast-fade-in 0.5s ease-in-out;
}
.toast-notification-leave-active {
  animation: toast-fade-in 0.5s ease-in-out reverse;
}
@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
