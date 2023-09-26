<template>
  <div class="flex bg-slate-900 md:border-r border-slate-900/10">
    <!-- Less than sm -->
    <div
      class="w-full flex md:hidden justify-between items-center h-16 px-8 border-b bg-slate-900 text-gray-400 z-[5]"
    >
      <div class="flex">
        <button
          type="button"
          class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          @click="openMobileMenuModal"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <router-link
          to="/workspace"
          class="text-gray-50 ml-6 flex mx-auto items-center"
        >
          <div class="rounded-md bg-slate-500/75 p-[.70rem] flex items-center">
            <span class="font-bold text-slate-900 text-xl leading-4">W</span>
          </div>
          <span class="ml-3 font-bold text-xl">Workspace</span>
        </router-link>
      </div>
      <div class="flex">
        <div class="flex space-x-4 px-4">
          <tippy content="Search" theme="demo">
            <router-link
              class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              to="/search"
            >
              <span class="sr-only">Search</span>
              <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
            </router-link>
          </tippy>
          <!-- Admin Dropdown -->
          <Menu
            v-show="canManageSpecialEditions || canManageWire"
            as="div"
            class="block md:hidden relative"
          >
            <div>
              <tippy content="Admin" theme="demo">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
        <div class="pl-4 border-l border-slate-50/10">
          <!-- Profile dropdown -->
          <Menu as="div" class="block md:hidden relative">
            <div>
              <tippy content="User Menu" theme="demo">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <span class="sr-only">Open user menu.</span>
                  <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
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
                class="origin-top-right absolute right-0 mt-2 w-[200px] rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
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
                  <a
                    class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                    :href="`${metadata.user_support.help_url}`"
                    target="_blank"
                    >User Support
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
    <!-- md to xl --->
    <div class="hidden md:block 2xl:hidden">
      <div class="flex grow-0 flex-col max-h-full min-h-screen w-[80px]">
        <div class="flex grow flex-col pt-6">
          <div class="flex justify-center items-center pb-6">
            <router-link to="/workspace">
              <div
                class="rounded-md bg-slate-500/75 p-[.70rem] flex items-center"
              >
                <span class="font-bold text-slate-900 text-xl leading-4"
                  >W</span
                >
              </div>
            </router-link>
          </div>
          <template
            v-for="(category, index) in navigationItems"
            :key="category"
          >
            <ul class="pl-4 py-4 text-gray-400 space-y-1">
              <template
                v-for="categoryItem in category.items"
                :key="categoryItem"
              >
                <li>
                  <div
                    :class="
                      isActiveRoute(categoryItem.routeName)
                        ? 'text-gray-50 bg-slate-800/90 rounded-l-lg'
                        : 'hover:text-gray-50'
                    "
                    class="cursor-pointer"
                  >
                    <tippy
                      :content="categoryItem.tooltip"
                      placement="right"
                      theme="demo"
                    >
                      <router-link
                        :to="categoryItem.routeLink"
                        class="flex items-center justify-center h-12 w-12"
                      >
                        <template v-if="isActiveRoute(categoryItem.routeName)">
                          <component
                            :is="categoryItem.icon + 'IconSolid'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <component
                            :is="categoryItem.icon + 'Icon'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                      </router-link>
                    </tippy>
                  </div>
                </li>
              </template>
            </ul>
            <template v-if="index < navigationItems.length - 1">
              <span class="mx-4 border-t border-slate-900/10"></span>
            </template>
          </template>
        </div>
        <div class="pb-6 grow-0">
          <ul class="pl-7 py-4 font-medium text-gray-400 space-y-1">
            <li>
              <div>
                <tippy content="Settings" placement="right" theme="demo">
                  <div
                    class="flex items-center py-2 cursor-pointer hover:text-gray-50"
                  >
                    <Cog8ToothIcon class="h-6 w-6" aria-hidden="true" />
                  </div>
                </tippy>
              </div>
            </li>
            <li>
              <tippy content="About" placement="right" theme="demo">
                <button
                  class="flex items-center py-2 cursor-pointer hover:text-gray-50"
                  @click="openAboutDialog"
                >
                  <QuestionMarkCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </tippy>
            </li>
            <li>
              <tippy content="Exit Demo" placement="right" theme="demo">
                <router-link to="/">
                  <div
                    class="flex items-center py-2 cursor-pointer hover:text-gray-50"
                  >
                    <ArrowLeftOnRectangleIcon
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                </router-link>
              </tippy>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--- 2xl or higher - TODO: Rework how the width works --->
    <div class="hidden 2xl:block">
      <div
        class="flex grow-0 flex-col max-h-full min-h-screen w-[260px] text-sm"
      >
        <div class="flex grow flex-col pt-6">
          <div class="text-gray-50 flex px-4 pb-6">
            <router-link to="/workspace" class="flex items-center px-4">
              <div
                class="rounded-md bg-slate-500/75 p-[.70rem] flex items-center"
              >
                <span class="font-bold text-slate-900 text-xl leading-4"
                  >W</span
                >
              </div>
              <span class="ml-3 font-bold text-2xl">Workspace</span>
            </router-link>
          </div>
          <template v-for="category in navigationItems" :key="category">
            <div class="text-gray-400 font-medium px-8 py-2">
              {{ category.categoryLabel }}
            </div>
            <ul class="pl-6 py-3 font-medium text-gray-400 space-y-1">
              <template
                v-for="categoryItem in category.items"
                :key="categoryItem"
              >
                <li>
                  <div>
                    <router-link :to="categoryItem.routeLink">
                      <div
                        :class="
                          isActiveRoute(categoryItem.routeName)
                            ? 'text-gray-50 bg-slate-800/90 rounded-l-lg'
                            : 'hover:text-gray-50'
                        "
                        class="flex items-center px-4 py-3 cursor-pointer"
                      >
                        <template v-if="isActiveRoute(categoryItem.routeName)">
                          <component
                            :is="categoryItem.icon + 'IconSolid'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <component
                            :is="categoryItem.icon + 'Icon'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <span class="ml-4 font-medium">{{
                          categoryItem.itemLabel
                        }}</span>
                      </div>
                    </router-link>
                  </div>
                </li>
              </template>
            </ul>
          </template>
        </div>
        <div class="pb-4 grow-0">
          <ul class="pl-6 py-4 font-medium text-gray-400 space-y-1">
            <li>
              <div>
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-gray-50"
                >
                  <Cog8ToothIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Settings</span>
                </div>
              </div>
            </li>
            <li>
              <div>
                <button
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-gray-50"
                  @click="openAboutDialog"
                >
                  <QuestionMarkCircleIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">About</span>
                </button>
              </div>
            </li>
            <li>
              <router-link to="/">
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-gray-50"
                >
                  <ArrowLeftOnRectangleIcon
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                  <span class="ml-4 font-medium">Exit Workspace</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Mobile Side Menu -->
  <TransitionRoot appear :show="isMobileMenuOpen" as="template">
    <Dialog as="div" class="block md:hidden" @close="closeMobileMenuModal">
      <div class="fixed z-20 inset-0 overflow-y-auto w-full">
        <div class="min-h-screen text-center">
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-300"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="relative min-h-screen w-72 max-w-calc[(100%-3rem)] p-6 text-left align-top transition-all transform text-gray-400 bg-slate-900 shadow-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center hover:text-gray-50"
                tabindex="0"
                @click="closeMobileMenuModal"
              >
                <span class="sr-only">Close main menu</span
                ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="flex text-gray-50 py-6">
                <router-link
                  to="/workspace"
                  class="ml-4 flex mx-auto items-center"
                >
                  <div
                    class="rounded-md bg-slate-500/75 p-[.70rem] flex items-center"
                  >
                    <span class="font-bold text-slate-900 text-xl leading-4"
                      >W</span
                    >
                  </div>
                  <span class="ml-3 font-bold text-2xl">Workspace</span>
                </router-link>
              </div>
              <div class="text-sm">
                <template v-for="category in navigationItems" :key="category">
                  <div class="text-gray-400 font-medium py-2 px-4">
                    {{ category.categoryLabel }}
                  </div>
                  <ul class="py-3 pl-4 font-medium text-gray-400 space-y-1">
                    <template
                      v-for="categoryItem in category.items"
                      :key="categoryItem"
                    >
                      <li>
                        <div>
                          <router-link :to="categoryItem.routeLink" class="">
                            <div
                              :class="
                                isActiveRoute(categoryItem.routeName)
                                  ? 'text-gray-50 bg-slate-800/90'
                                  : 'hover:text-gray-50 '
                              "
                              class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                            >
                              <template
                                v-if="isActiveRoute(categoryItem.routeName)"
                              >
                                <component
                                  :is="categoryItem.icon + 'IconSolid'"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </template>
                              <template v-else>
                                <component
                                  :is="categoryItem.icon + 'Icon'"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </template>
                              <span class="ml-4">{{
                                categoryItem.itemLabel
                              }}</span>
                            </div>
                          </router-link>
                        </div>
                      </li>
                    </template>
                  </ul>
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <!-- About Dialog -->
  <TransitionRoot appear :show="isAboutDialogOpen" as="template">
    <Dialog as="div" @close="closeAboutDialog">
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
                      Quickly get an overview of your recent activities, such as
                      products you recently saved, as well those recently
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
                      your saved products, you'll easily be able to manage your
                      saved products.
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
                    @click.prevent="closeAboutDialog"
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <!-- Test Console Dialog -->
  <TestConsoleDialog
    :isOpen="isTestConsoleMenuOpen"
    @close="closeTestConsoleModal"
  />
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import {
  products,
  savedProducts,
  favoriteProducts,
  collectionProducts,
} from "@/domains/demo/data";
import { computed, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
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
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BookmarkIcon,
  Cog8ToothIcon,
  FolderIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  BookmarkIcon as BookmarkIconSolid,
  FolderIcon as FolderIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from "@heroicons/vue/24/solid";
import MobileSideMenu from "./MobileSideMenu.vue";
import TestConsoleDialog from "@/shared/components/TestConsoleDialog.vue";
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
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BookmarkIcon,
    BookmarkIconSolid,
    Cog8ToothIcon,
    FolderIcon,
    FolderIconSolid,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    Squares2X2Icon,
    Squares2X2IconSolid,
    UserCircleIcon,
    WrenchIcon,
    XMarkIcon,
    MobileSideMenu,
    TestConsoleDialog,
  },
  setup() {
    const metadata = inject("metadata");
    const environment = ref(import.meta.env.MODE);
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const currentUsername = computed(() => store.state.user.user.name);
    const isTestConsoleMenuOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isAboutDialogOpen = ref(false);
    const removeSearch = ref(false);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );
    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);

    const openTestConsoleModal = () => {
      isTestConsoleMenuOpen.value = true;
    };

    const closeTestConsoleModal = () => {
      isTestConsoleMenuOpen.value = false;
    };

    const closeMobileMenuModal = () => {
      isMobileMenuOpen.value = false;
    };

    const openMobileMenuModal = () => {
      isMobileMenuOpen.value = true;
    };

    const closeAboutDialog = () => {
      isAboutDialogOpen.value = false;
    };

    const openAboutDialog = () => {
      isAboutDialogOpen.value = true;
    };

    const navigationItems = [
      {
        categoryLabel: "Menu",
        items: [
          {
            itemLabel: "Dashboard",
            icon: "Squares2X2",
            tooltip: "Dashboard",
            routeLink: "/workspace",
            routeName: "workspace-dashboard",
          },
          {
            itemLabel: "Saved",
            icon: "Bookmark",
            tooltip: "Saved Products",
            routeLink: "/workspace/saved",
            routeName: "workspace-saved",
          },
          {
            itemLabel: "Collections",
            icon: "Folder",
            tooltip: "Collections",
            routeLink: "/workspace/collections",
            routeName: "workspace-collections",
          },
        ],
      },
    ];

    onMounted(() => {
      store.dispatch("savedSearches/getAllSearches");
    });

    const selectItemEventHandler = (item) => {
      console.log("selectItemEventHandler: ", item);
      if (removeSearch.value) {
        console.log("no routing");
        removeSearch.value = false;
      } else {
        const route = router.resolve({
          name: "search",
          query: {
            text: item.text,
            per_page: 10,
          },
        });
        window.open(route.href, "_blank");
      }
    };

    const onEnter = (e) => {
      store.dispatch("savedSearches/addSearch", {
        text: e.target.value,
        type: "user",
      });
      const route = router.resolve({
        name: "search",
        query: {
          text: e.target.value,
          per_page: 10,
        },
      });
      window.open(route.href, "_blank");
    };

    const deleteSearch = (item) => {
      removeSearch.value = true;
      store.dispatch("savedSearches/deleteSearch", item);
    };

    const isActiveRoute = (name) => {
      return route.name === name;
    };

    return {
      dayjs,
      metadata,
      environment,
      route,
      currentUsername,
      canManageWire,
      canManageSpecialEditions,
      searches,
      loading,
      products,
      savedProducts,
      favoriteProducts,
      collectionProducts,
      isTestConsoleMenuOpen,
      closeTestConsoleModal,
      openTestConsoleModal,
      isMobileMenuOpen,
      openMobileMenuModal,
      closeMobileMenuModal,
      navigationItems,
      selectItemEventHandler,
      onEnter,
      deleteSearch,
      isAboutDialogOpen,
      closeAboutDialog,
      openAboutDialog,
      isActiveRoute,
    };
  },
};
</script>
<style lang="scss">
.simple-typeahead {
  position: relative;
  width: 100%;
}
.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 11;
  box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
  border-width: 1px;
}
</style>
