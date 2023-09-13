<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <div
      class="hidden md:flex grow-0 flex-col bg-slate-900 max-h-full min-h-screen w-[80px]"
    >
      <div class="flex grow flex-col pt-6">
        <div class="pb-6">
          <router-link to="/workspace">
            <div
              class="mx-auto bg-slate-500/75 w-[45px] h-[45px] rounded flex justify-center items-center"
            >
              <span class="font-bold text-slate-900 text-2xl leading-4">W</span>
            </div>
          </router-link>
        </div>
        <ul class="py-2 mx-auto text-gray-400 space-y-1">
          <li>
            <tippy content="Dashboard" placement="right" theme="demo">
              <div
                :class="
                  route.name == 'workspace-dashboard'
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <router-link
                  to="/workspace"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                </router-link>
              </div>
            </tippy>
          </li>
          <!-- <li>
            <tippy content="My Products" placement="right" theme="demo">
              <div
                :class="
                  route.name == 'myProducts'
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <router-link
                  to="/workspace/products"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BriefcaseIcon class="h-6 w-6" aria-hidden="true" />
                </router-link>
              </div>
            </tippy>
          </li> -->
          <li>
            <tippy content="Saved Products" placement="right" theme="demo">
              <div
                :class="
                  route.name == 'workspace-saved'
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <router-link
                  to="/workspace/saved"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BookmarkIcon class="h-6 w-6" aria-hidden="true" />
                </router-link>
              </div>
            </tippy>
          </li>
          <!-- <li>
            <tippy content="Collections" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#collections')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#collections"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <FolderIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li> -->
        </ul>
      </div>
      <ul class="pb-6 mx-auto text-gray-400 space-y-1">
        <li>
          <tippy content="About" placement="right" theme="demo">
            <button
              class="flex items-center justify-center h-12 w-12"
              @click="openAboutDialog"
            >
              <InformationCircleIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </tippy>
        </li>
        <li>
          <tippy content="Exit Workspace" placement="right" theme="demo">
            <router-link to="/">
              <div class="flex items-center justify-center h-12 w-12">
                <ArrowLeftOnRectangleIcon class="h-6 w-6" aria-hidden="true" />
              </div>
            </router-link>
          </tippy>
        </li>
      </ul>
    </div>
    <!-- Right Panel -->
    <div class="flex flex-col min-h-screen w-full h-full">
      <div class="relative grow">
        <!-- Desktop Nav Bar -->
        <div
          class="hidden h-16 px-8 border-b border-slate-900/10 shadow-sm md:block"
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
        <!-- Mobile Nav Bar -->
        <div
          class="block md:hidden h-16 px-8 border-b bg-slate-900 text-gray-400"
        >
          <p class="text-xs text-center pb-1">
            {{ metadata.system_classification }}
          </p>
          <div class="flex justify-between items-center">
            <button
              type="button"
              class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              @click="openMobileMenuModal"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <div class="flex">
              <div class="flex space-x-4 px-4">
                <tippy content="Search" theme="demo">
                  <router-link
                    class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
        </div>
        <!-- Content Area -->
        <div
          class="flex flex-col text-gray-900 bg-slate-50 w-full min-h-[calc(100vh-4rem)] h-full items-center"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
  <!-- Mobile side menu -->
  <MobileSideMenu :isOpen="isMobileMenuOpen" @close="closeMobileMenuModal" />
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
  <!-- Test Console -->
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
  // AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BookmarkIcon,
  // CheckIcon,
  // ChevronDownIcon,
  // FolderIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  // PlusIcon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
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
    // AdjustmentsHorizontalIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BookmarkIcon,
    // CheckIcon,
    // ChevronDownIcon,
    // FolderIcon,
    HomeIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    // PlusIcon,
    UserCircleIcon,
    WrenchIcon,
    XMarkIcon,
    // MockProductCard,
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
    const isMobileMenuOpen = ref(false);
    const removeSearch = ref(false);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );
    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);
    const sortOptions = [
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];
    const selectedSort = ref(sortOptions[0]);
    const isTestConsoleMenuOpen = ref(false);
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
    const isActiveTheme = (selection) => {
      if (selection === localStorage.theme) {
        return "text-amber-600";
      }
    };
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

    const isAboutDialogOpen = ref(false);
    const closeAboutDialog = () => {
      isAboutDialogOpen.value = false;
    };
    const openAboutDialog = () => {
      isAboutDialogOpen.value = true;
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
      sortOptions,
      products,
      savedProducts,
      favoriteProducts,
      collectionProducts,
      selectedSort,
      isTestConsoleMenuOpen,
      closeTestConsoleModal,
      openTestConsoleModal,
      isMobileMenuOpen,
      openMobileMenuModal,
      closeMobileMenuModal,
      isActiveTheme,
      selectItemEventHandler,
      onEnter,
      deleteSearch,
      isAboutDialogOpen,
      closeAboutDialog,
      openAboutDialog,
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
