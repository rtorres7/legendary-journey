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
        :simple="item.simple"
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
  <div class="h-screen md:h-full flex flex-col md:flex-row">
    <WorkspaceNavigation />
    <div class="flex h-screen grow flex-col overflow-hidden">
      <div class="flex min-h-0 flex-1">
        <div class="flex w-full">
          <div class="relative grow bg-slate-50 text-gray-900">
            <!-- Content Area -->
            <div class="top-0 bottom-0 h-full overflow-y-scroll">
              <!-- Navigation Bar (md or higher) -->
              <div
                class="hidden bg-white h-16 px-8 border-b border-slate-900/10 shadow-sm md:block justify-between items-center"
              >
                <p class="text-xs text-center text-gray-500 pb-1">
                  {{ metadata.system_classification }}
                </p>
                <div class="flex justify-between items-center">
                  <div class="w-full max-w-[750px] flex">
                    <div class="self-center">
                      <MagnifyingGlassIcon
                        class="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <vue3-simple-typeahead
                      id="typeahead_id"
                      ref="typeaheadRef"
                      class="px-4 focus-visible:outline-none bg-transparent w-full text-slate-900 placeholder-shown:truncate text-sm"
                      aria-label="Search"
                      placeholder="Search for keywords or products"
                      :items="searches"
                      :min-input-length="1"
                      :item-projection="
                        (item) => {
                          return item.text;
                        }
                      "
                      :select-on-tab="false"
                      @selectItem="selectItemEventHandler"
                      @keydown.enter.prevent="onEnter"
                    >
                      <template #list-item-text="slot">
                        <div
                          class="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-2 py-1 flex justify-between"
                          :class="
                            slot.item.type === 'user'
                              ? 'text-purple-800 '
                              : 'text-slate-800'
                          "
                        >
                          <span
                            v-html="
                              slot.boldMatchText(slot.itemProjection(slot.item))
                            "
                          />
                          <template v-if="slot.item.type === 'user'">
                            <button @click="deleteSearch(slot.item)">
                              <XMarkIcon
                                class="h-5 w-5 text-slate-800"
                                aria-hidden="true"
                              />
                            </button>
                          </template>
                        </div>
                      </template>
                    </vue3-simple-typeahead>
                  </div>
                  <div class="flex">
                    <div class="flex space-x-4 px-4">
                      <!-- Admin Dropdown -->
                      <Menu
                        v-show="canManageSpecialEditions || canManageWire"
                        as="div"
                        class="hidden md:block relative"
                      >
                        <div>
                          <tippy content="Admin" theme="demo">
                            <MenuButton
                              class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            >
                              <span class="sr-only">Admin Menu</span>
                              <WrenchIcon class="h-6 w-6" aria-hidden="true" />
                            </MenuButton>
                          </tippy>
                        </div>
                        <transition
                          enterActiveClass="transition ease-out duration-100"
                          enterFromClass="transform opacity-0 scale-95"
                          enterToClass="transform opacity-100 scale-100"
                          leaveActiveClass="transition ease-in duration-75"
                          leaveFromClass="transform opacity-100 scale-100"
                          leaveToClass="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            class="origin-top-right absolute right-0 mt-2 w-48 z-10 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                          >
                            <MenuItem v-show="canManageWire">
                              <router-link
                                class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                                :to="{
                                  name: 'products',
                                  params: {
                                    date: dayjs().format('YYYY-MM-DD'),
                                  },
                                }"
                              >
                                Manage Products
                              </router-link>
                            </MenuItem>
                            <MenuItem v-show="canManageSpecialEditions">
                              <router-link
                                to="/feeds"
                                class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                              >
                                Manage Special Editions
                              </router-link>
                            </MenuItem>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </div>
                    <div
                      class="pl-4"
                      :class="
                        canManageWire || canManageSpecialEditions
                          ? 'border-l border-slate-900/10'
                          : ''
                      "
                    >
                      <!-- Profile dropdown -->
                      <Menu as="div" class="hidden md:block relative">
                        <div>
                          <tippy content="User Menu" theme="demo">
                            <MenuButton
                              class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            >
                              <span class="sr-only">Open user menu.</span>
                              <UserCircleIcon
                                class="h-6 w-6"
                                aria-hidden="true"
                              />
                            </MenuButton>
                          </tippy>
                        </div>
                        <transition
                          enterActiveClass="transition ease-out duration-100"
                          enterFromClass="transform opacity-0 scale-95"
                          enterToClass="transform opacity-100 scale-100"
                          leaveActiveClass="transition ease-in duration-75"
                          leaveFromClass="transform opacity-100 scale-100"
                          leaveToClass="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            class="origin-top-right absolute right-0 mt-2 w-40 z-10 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                          >
                            <MenuItem>
                              <router-link
                                to="/"
                                class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                              >
                                {{ currentUsername }}
                              </router-link>
                            </MenuItem>
                            <MenuItem>
                              <router-link
                                to="/workspace"
                                class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                              >
                                My Workspace
                              </router-link>
                            </MenuItem>
                            <MenuItem>
                              <a
                                class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                                :href="`${metadata.user_support.help_url}`"
                                target="_blank"
                                >User Support
                              </a>
                            </MenuItem>
                            <template v-if="environment === 'offline'">
                              <MenuItem>
                                <a
                                  class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                                  @click="openTestConsoleModal"
                                  >Test Console</a
                                >
                              </MenuItem>
                            </template>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col w-full h-full items-center">
                <template v-if="loadingUser">
                  <div class="max-w-fit m-auto mt-[30vh]">
                    <MaxLoadingSpinner class="w-32 h-32" />
                  </div>
                </template>
                <template v-else>
                  <router-view />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import dayjs from "dayjs/esm/index.js";
import { computed, inject, provide, ref } from "vue";
import { useStore } from "vuex";
import { useCookies } from "vue3-cookies";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  WrenchIcon,
} from "@heroicons/vue/24/outline";
import useNotifications from "@workspace/composables/notifications.js";
import ToastNotification from "@workspace/components/ToastNotification.vue";
import WorkspaceNavigation from "@workspace/components/WorkspaceNavigation.vue";
export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MagnifyingGlassIcon,
    UserCircleIcon,
    WrenchIcon,
    ToastNotification,
    WorkspaceNavigation,
  },
  setup() {
    const store = useStore();
    const metadata = inject("metadata");
    const { cookies } = useCookies();
    const {
      notifications,
      createNotification,
      createSimpleNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
    } = useNotifications();

    const loadingUser = computed(() => store.state.user.loading);

    provide("create-notification", createNotification);
    provide("create-simple-notification", createSimpleNotification);

    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );

    const dialogPreference = ref(cookies.get("betaInfoNotice"));

    const isOpen = ref(true);

    const close = () => {
      cookies.set("betaInfoNotice", true, "21d");
      isOpen.value = false;
    };

    return {
      dayjs,
      metadata,
      loadingUser,
      notifications,
      createNotification,
      createSimpleNotification,
      removeNotifications,
      stopBodyOverflow,
      allowBodyOverflow,
      canManageWire,
      canManageSpecialEditions,
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
