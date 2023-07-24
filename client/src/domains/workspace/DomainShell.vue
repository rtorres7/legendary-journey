<template>
  <div>
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
    </div>
    <div class="h-full">
      <WorkspaceNavigation>
        <router-view />
      </WorkspaceNavigation>
    </div>
  </div>
</template>
<script>
import { onMounted, provide } from "vue";
import { useStore } from "vuex";
import useNotifications from "@workspace/composables//notifications.js";
import ToastNotification from "@workspace/components/ToastNotification.vue";
import WorkspaceNavigation from "@workspace/components/WorkspaceNavigation.vue";
export default {
  components: {
    ToastNotification,
    WorkspaceNavigation,
  },
  setup() {
    const store = useStore();
    const {
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    } = useNotifications();

    provide("create-notification", createNotification);

    onMounted(() => {
      store.dispatch("alerts/loadAlerts");
      store.dispatch("user/loadUser");
      store.dispatch("metadata/loadMetadata");
      store.dispatch("specialEditions/loadConceptsLinks");
    });

    return {
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    };
  },
};
</script>
<style lang="scss">
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
