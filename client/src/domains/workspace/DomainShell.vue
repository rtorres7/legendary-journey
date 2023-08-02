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
  <template v-if="!dialogPreference">
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" :static="true" @close="() => null">
        <div class="fixed inset-0 z-20 overflow-y-auto w-full">
          <div class="min-h-screen px-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/30" />
            </TransitionChild>
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="inline-block max-w-[650px] w-full p-6 text-left align-middle transition-all transform text-gray-900 bg-white shadow-lg rounded-lg"
                v-bind="$attrs"
              >
                <div class="border-b border-slate-900/10 pb-4">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg">My Workspace</span
                    ><span
                      class="bg-blue-600 text-gray-50 px-2 py-1 rounded-md text-sm uppercase"
                      >Beta</span
                    >
                  </div>
                </div>
                <div class="py-4">
                  <div class="py-3">
                    <h1 class="text-gray-700 text-2xl font-medium pb-4">
                      My Workspace: A new tool designed to enhance your daily
                      activities
                    </h1>
                    <p class="text-gray-700 py-2">
                      Built to reside within the Current ecosystem, your
                      activities on Current will translate and tailor your
                      Workspace experience.
                    </p>
                  </div>
                  <div class="flex flex-col space-y-3 py-3">
                    <div>
                      <h2 class="text-gray-500 font-medium text-xl pb-4">
                        Dashboard
                      </h2>
                      <p class="pb-4">
                        Quickly get an overview of your recent activities, such
                        as products you recently saved, as well those recently
                        created and published by your organization. You'll also
                        see meaningful stats pertaining to your organization.
                      </p>
                    </div>
                    <div>
                      <h2 class="text-gray-500 font-medium text-xl pb-4">
                        Saved Products
                      </h2>
                      <p class="pb-4">
                        Whether it's through filtering down or sorting through
                        your saved products, you'll easily be able to manage
                        your saved products.
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-1 py-3 text-gray-600">
                    <p>
                      More features will be announced at a later date. For
                      questions/feedback regarding the Workspace, we welcome you
                      to
                      <a
                        :href="`${metadata.user_support.help_url}`"
                        class="text-blue-600 focus-visible:outline-none"
                      >
                        contact us</a
                      >.
                    </p>
                  </div>
                </div>
                <div class="flex justify-end pt-4 border-t border-slate-900/10">
                  <div class="flex space-x-3">
                    <button
                      class="bg-transparent hover:bg-slate-50 select-none text-sm shadow-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 border border-slate-900/10"
                      @click.prevent="close"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
</template>
<script>
import { inject, onMounted, provide, ref } from "vue";
import { useStore } from "vuex";
import { useCookies } from "vue3-cookies";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import useNotifications from "@workspace/composables/notifications.js";
import ToastNotification from "@workspace/components/ToastNotification.vue";
import WorkspaceNavigation from "@workspace/components/WorkspaceNavigation.vue";
export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    ToastNotification,
    WorkspaceNavigation,
  },
  setup() {
    const metadata = inject("metadata");
    const store = useStore();
    const { cookies } = useCookies();
    const {
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    } = useNotifications();

    provide("create-notification", createNotification);

    const dialogPreference = ref(cookies.get("betaInfoNotice"));

    const isOpen = ref(true);

    const close = () => {
      cookies.set("betaInfoNotice", true, "21d");
      isOpen.value = false;
    };

    onMounted(() => {
      store.dispatch("alerts/loadAlerts");
      store.dispatch("user/loadUser");
      store.dispatch("metadata/loadMetadata");
      store.dispatch("specialEditions/loadConceptsLinks");
    });

    return {
      metadata,
      notifications,
      createNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
      dialogPreference,
      isOpen,
      close,
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
