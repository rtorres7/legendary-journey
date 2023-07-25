<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    ref="topOfApp"
    class="min-h-full bg-mission-blue dark:bg-dark-space-blue energy:bg-zinc-800"
    tabindex="-1"
  >
    <transition-group
      name="toast-notification"
      tag="div"
      class="z-[100] fixed top-2 right-2 flex flex-col-reverse gap-3"
      aria-live="assertive"
      @before-enter="stopBodyOverflow"
      @after-enter="allowBodyOverflow"
      @before-leave="stopBodyOverflow"
      @after-leave="allowBodyOverflow"
    >
      <ToastNotification
        v-for="item in notifications"
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
    <button class="skipLink" @click="skipToMain">Skip to main content</button>
    <TheBanner v-if="!['attachment'].includes($route.name)" />
    <main
      role="main"
      class="bg-white dark:bg-slate-900 energy:bg-zinc-900 text-slate-900 dark:text-slate-300 energy:text-zinc-300"
    >
      <template v-if="!loadingAlerts && undismissedAlerts.length > 0">
        <ul
          id="app-announcements"
          class="print:hidden bg-orange-200 text-slate-900"
          role="alert"
        >
          <template v-for="alert in undismissedAlerts" :key="alert">
            <li
              v-if="!alert.destroyed"
              class="flex justify-between items-center px-10 py-2 first:pt-4 last:pb-4"
            >
              <div class="inline-block leading-relaxed">
                <MegaphoneIcon class="inline h-6 w-6" aria-hidden="true" />
                <span class="sr-only">new notification from Current</span>
                <strong class="font-semibold mx-2">{{ alert.title }}</strong>
                <span v-html="alert.message"></span>
              </div>
              <button
                class="ml-2 text-zinc-600 hover:text-zinc-900"
                @click="storeDismissedAlertInCookie(alert)"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </li>
          </template>
        </ul>
      </template>
      <div
        ref="mainContent"
        class="max-w-8xl min-h-[80vh] md:min-h-[88vh] lg:min-h-[65vh] mx-auto py-3 px-4 sm:px-6 lg:px-8"
        tabindex="-1"
      >
        <template v-if="loadingUser">
          <div class="max-w-fit m-auto mt-[30vh]">
            <MaxLoadingSpinner class="w-32 h-32" />
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
  </div>
</template>
<script>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
import { reject } from "lodash";
import useNotifications from "@current/composables//notifications";
import AuthorizatonWrapper from "@current/components/AuthorizationWrapper.vue";
import ScrollToTopButton from "@current/components/ScrollToTopButton.vue";
import TheBanner from "@current/components/TheBanner.vue";
import TheFooter from "@current/components/TheFooter.vue";
import ToastNotification from "@current/components/ToastNotification.vue";
import { MegaphoneIcon, XMarkIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    AuthorizatonWrapper,
    TheBanner,
    ScrollToTopButton,
    TheFooter,
    ToastNotification,
    MegaphoneIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const { cookies } = useCookies();
    const topOfApp = ref(null);
    const mainContent = ref(null);

    const loadingUser = computed(() => store.state.user.loading);
    const loadingAlerts = computed(() => store.state.alerts.loading);
    const alerts = computed(() => store.state.alerts.alerts);

    const undismissedAlerts = computed(() => {
      return reject(alerts.value, function (alert) {
        return cookies.get("alert_" + alert.id);
      });
    });
    const {
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    } = useNotifications();

    provide("create-notification", createNotification);

    watch(useRoute(), () => {
      topOfApp.value.focus();
    });

    onMounted(() => {
      store.dispatch("alerts/loadAlerts");
      store.dispatch("user/loadUser");
      store.dispatch("metadata/loadMetadata");
      store.dispatch("specialEditions/loadConceptsLinks");
    });

    const skipToMain = () => {
      mainContent.value.focus();
    };

    const storeDismissedAlertInCookie = (alert) => {
      cookies.set("alert_" + alert.id, true, alert.expiresIn);
      alert.destroyed = true;
    };

    return {
      loadingAlerts,
      undismissedAlerts,
      loadingUser,
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
      topOfApp,
      mainContent,
      skipToMain,
      storeDismissedAlertInCookie,
    };
  },
};
</script>
<style lang="scss">
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

#app-announcements {
  a {
    @apply text-blue-900;
    @apply font-semibold;
  }
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
