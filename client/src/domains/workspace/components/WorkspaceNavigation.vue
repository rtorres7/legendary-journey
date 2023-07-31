<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <div class="hidden md:block bg-slate-900 min-h-screen w-20">
      <div class="flex flex-col">
        <div class="h-16">
          <router-link to="/">
            <img
              class="mx-auto w-16 h-16"
              src="@/shared/assets/nctc_logo.svg"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
        </div>
        <ul class="py-2 mx-auto text-gray-400 space-y-1">
          <li>
            <tippy content="Dashboard" placement="right" theme="demo">
              <div
                :class="
                  route.name == 'dashboard'
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
          <li>
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
          </li>
          <!-- <li>
            <tippy content="Saved Products" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#saved')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#saved"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BookmarkIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li> -->
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
                <Menu as="div" class="hidden md:block relative">
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
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                    >
                      <MenuItem>
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
                      <MenuItem>
                        <router-link
                          to="/special_editions"
                          class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                        >
                          Manage Special Editions
                        </router-link>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
              <div class="pl-4 border-l border-slate-900/10">
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
                      class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
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
                <Menu as="div" class="block md:hidden relative">
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
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                    >
                      <MenuItem>
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
                      <MenuItem>
                        <router-link
                          to="/special_editions"
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
                      class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
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
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import {
  products,
  savedProducts,
  favoriteProducts,
  collectionProducts,
} from "@/domains/demo/data";
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  // AdjustmentsHorizontalIcon,
  Bars3Icon,
  // BookmarkIcon,
  BriefcaseIcon,
  // CheckIcon,
  // ChevronDownIcon,
  // FolderIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  // PlusIcon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import MobileSideMenu from "./MobileSideMenu.vue";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    // AdjustmentsHorizontalIcon,
    Bars3Icon,
    // BookmarkIcon,
    BriefcaseIcon,
    // CheckIcon,
    // ChevronDownIcon,
    // FolderIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    // PlusIcon,
    UserCircleIcon,
    WrenchIcon,
    XMarkIcon,
    // MockProductCard,
    MobileSideMenu,
  },
  setup() {
    const metadata = inject("metadata");
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const currentUsername = computed(() => store.state.user.user.name);
    const isMobileMenuOpen = ref(false);
    const removeSearch = ref(false);
    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);
    const sortOptions = [
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];
    const selectedSort = ref(sortOptions[0]);
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
    const selectItemEventHandler = (item) => {
      console.log("selectItemEventHandler: ", item);
      if (removeSearch.value) {
        console.log("no routing");
        removeSearch.value = false;
      } else {
        router.push({
          name: "search",
          query: {
            text: item.text,
          },
        });
      }
    };
    const onEnter = (e) => {
      store.dispatch("savedSearches/addSearch", {
        text: e.target.value,
        type: "user",
      });
      if (
        localStorage.getItem("lastSort") === "asc" ||
        localStorage.getItem("lastSort") === "desc"
      ) {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_dir: localStorage.getItem("lastSort"),
          },
        });
      } else if (localStorage.getItem("lastSort") === "score") {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_field: localStorage.getItem("lastSort"),
          },
        });
      } else {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
          },
        });
      }
    };
    return {
      dayjs,
      metadata,
      route,
      currentUsername,
      searches,
      loading,
      sortOptions,
      products,
      savedProducts,
      favoriteProducts,
      collectionProducts,
      selectedSort,
      isMobileMenuOpen,
      openMobileMenuModal,
      closeMobileMenuModal,
      isActiveTheme,
      selectItemEventHandler,
      onEnter,
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
