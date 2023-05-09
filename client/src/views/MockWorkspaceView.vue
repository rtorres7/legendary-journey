<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <div class="hidden md:block bg-slate-900 min-h-screen w-20">
      <div class="flex flex-col">
        <div class="h-16">
          <img
            class="mx-auto w-16 h-16"
            src="@/assets/nctc_logo.svg"
            alt="NCTC. Seal. Link to homepage."
          />
        </div>
        <ul class="py-2 mx-auto text-gray-400 space-y-1">
          <li>
            <tippy content="Dashboard" placement="right">
              <div
                :class="
                  isActivePage('#dashboard')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#dashboard"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="My Products" placement="right">
              <div
                :class="
                  isActivePage('#products')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#products"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BriefcaseIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Saved Products" placement="right">
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
          </li>
          <li>
            <tippy content="Favorites" placement="right">
              <div
                :class="
                  isActivePage('#favorites')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#favorites"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <StarIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Collections" placement="right">
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
          </li>
        </ul>
      </div>
    </div>
    <!-- Right Panel -->
    <div class="flex flex-col min-h-screen w-full h-full">
      <div class="relative grow">
        <!-- Nav Bar -->
        <div
          class="h-16 px-8 border-b border-slate-900/10 shadow-sm flex justify-between items-center"
        >
          <div class="w-full flex">
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
                      ? 'text-purple-800 dark:text-purple-300 energy:text-purple-300'
                      : 'text-slate-800 dark:text-slate-300 energy:text-zinc-300'
                  "
                >
                  <span
                    v-html="slot.boldMatchText(slot.itemProjection(slot.item))"
                  />
                  <template v-if="slot.item.type === 'user'">
                    <button @click="deleteSearch(slot.item)">
                      <XMarkIcon
                        class="h-5 w-5 text-slate-800 dark:text-slate-300 energy:text-zinc-300"
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
                  <tippy content="Admin">
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
                          name: 'publish',
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
              <!-- Theme dropdown -->
              <Menu as="div" class="hidden md:block relative">
                <div>
                  <tippy content="Themes">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
                      :class="
                        selectedTheme === 'system'
                          ? 'text-gray-500 hover:text-gray-700'
                          : 'text-amber-600 hover:text-amber-700'
                      "
                    >
                      <span class="sr-only"
                        >Open menu for toggling color palettes.</span
                      >
                      <template v-if="selectedTheme === 'dark'">
                        <MoonIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <template v-else-if="selectedTheme === 'system'">
                        <template v-if="isDark">
                          <MoonIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else>
                          <SunIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                      </template>
                      <template v-else>
                        <SunIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
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
                    <MenuItem v-for="item in themeOptions" :key="item">
                      <a
                        :class="isActiveTheme(item)"
                        class="py-1 px-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        @click="changeTheme(item)"
                      >
                        <template v-if="item === 'light'">
                          <SunIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else-if="item === 'dark'">
                          <MoonIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else-if="item === 'system'">
                          <ComputerDesktopIcon
                            class="h-6 w-6"
                            aria-hidden="true"
                          /> </template
                        ><span class="capitalize">{{ item }}</span></a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <div class="pl-4 border-l border-slate-900/10">
              <!-- Profile dropdown -->
              <Menu as="div" class="hidden md:block relative">
                <div>
                  <tippy content="User Menu">
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
                        Alvaro Ramirez
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
        <!-- Content Area -->
        <div
          class="flex flex-col p-8 text-gray-900 bg-slate-50 w-full min-h-[calc(100vh-4rem)] h-full items-center"
        >
          <div class="max-w-[475px] sm:max-w-[1600px] w-full">
            <div :class="isActivePage('#dashboard') ? 'block' : 'hidden'">
              <div class="text-2xl text-gray-700">Alvaro's Workspace</div>
              <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div>
              <div class="py-6 flex justify-between items-center">
                <div class="text-lg font-bold">My Recent Products</div>
                <div
                  class="flex items-center text-gray-500 text-sm font-semibold"
                >
                  <span>More Products</span>
                  <ChevronRightIcon class="h-4 w-4" />
                </div>
              </div>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
              >
                <template v-for="n in 4" :key="n">
                  <div
                    class="bg-white rounded-md max-w-[464px] shadow-md hover:shadow-lg cursor-pointer mb-2"
                  >
                    <div class="max-h-[261px]">
                      <img src="@/assets/mocks/16x9_001_astronaut.jpg" alt="" />
                    </div>
                    <div class="flex flex-col py-3">
                      <div class="relative pb-6 pl-3 pr-5">
                        <p
                          class="font-semibold text-gray-700 line-clamp-2"
                          title="(U) Astronaut Buzz Aldrin named honorary brigadier general,
                        member of Space Force"
                        >
                          <span class="font-medium text-gray-500">(U)</span>
                          Astronaut Buzz Aldrin named honorary brigadier
                          general, member of Space Force
                        </p>
                        <div
                          class="text-gray-500 hover:text-gray-900 absolute top-0 right-0"
                        >
                          <Menu as="div" class="relative">
                            <div>
                              <tippy content="More" placement="bottom">
                                <MenuButton
                                  class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                >
                                  <span class="sr-only">More Options</span>
                                  <EllipsisVerticalIcon
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
                                class="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                              >
                                <MenuItem>
                                  <div
                                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                                  >
                                    <ShareIcon
                                      class="h-5 w-5"
                                      aria-hidden="true"
                                    /><span class="capitalize">Share</span>
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                                  >
                                    <BookmarkIcon
                                      class="h-5 w-5"
                                      aria-hidden="true"
                                    /><span class="capitalize">Save</span>
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                                  >
                                    <StarIcon
                                      class="h-5 w-5"
                                      aria-hidden="true"
                                    /><span class="capitalize">Favorite</span>
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                                  >
                                    <PencilSquareIcon
                                      class="h-5 w-5"
                                      aria-hidden="true"
                                    /><span class="capitalize">Edit</span>
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                                  >
                                    <TrashIcon
                                      class="h-5 w-5"
                                      aria-hidden="true"
                                    /><span class="capitalize">Delete</span>
                                  </div>
                                </MenuItem>
                              </MenuItems>
                            </transition>
                          </Menu>
                        </div>
                      </div>
                      <div
                        class="flex justify-between px-3 text-sm text-gray-500"
                      >
                        <div class="flex space-x-4">
                          <div>4 days ago</div>
                          <div class="text-blue-700 font-medium">
                            Space Travel
                          </div>
                        </div>
                        <div>101k views</div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div class="py-6 flex items-center">
                <div class="text-lg font-bold">Continue where you left off</div>
              </div>
              <div
                class="flex flex-col bg-white shadow-inner-sm rounded max-w-[464px]"
              >
                <div class="flex items-center space-x-4">
                  <MaxProductIcon
                    class="w-12 h-12 text-green-400"
                    icon="globe"
                  />
                  <div class="font-medium text-sm text-gray-400">Community</div>
                </div>
                <p>(U) Sample Draft Title</p>
                <div>15 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as dayjs from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  BookmarkIcon,
  BriefcaseIcon,
  ComputerDesktopIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronRightIcon } from "@heroicons/vue/24/solid";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BookmarkIcon,
    BriefcaseIcon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    PencilSquareIcon,
    ShareIcon,
    StarIcon,
    SunIcon,
    TrashIcon,
    UserCircleIcon,
    WrenchIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const removeSearch = ref(false);
    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);
    const isDark = ref(localStorage.getItem("theme") === "dark" ? true : false);
    if (localStorage.getItem("theme") === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    }
    const selectedTheme = ref(localStorage.getItem("theme"));
    const currentHash = ref(window.location.hash || "#dashboard");

    onMounted(() => {
      window.location.hash = window.location.hash || "#dashboard";
    });

    const changeTheme = (newTheme) => {
      selectedTheme.value = newTheme;
      localStorage.setItem("theme", newTheme);
      if (localStorage.theme === "system") {
        isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? true
          : false;
        document.documentElement.classList.remove(
          ...document.documentElement.classList
        );
        if (isDark.value) {
          document.documentElement.classList.add("dark");
        }
      } else {
        document.documentElement.classList.remove(
          ...document.documentElement.classList
        );
        document.documentElement.classList.add(localStorage.theme);
      }
      store.dispatch("localStorage/saveTheme", selectedTheme.value);
    };

    const isActiveTheme = (selection) => {
      if (selection === localStorage.theme) {
        return "text-amber-600";
      }
    };

    watch(selectedTheme, (newTheme) => {
      changeTheme(newTheme);
    });

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

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

    return {
      dayjs,
      themeOptions,
      searches,
      loading,
      isDark,
      selectedTheme,
      changeTheme,
      isActiveTheme,
      selectItemEventHandler,
      onEnter,
      isActivePage,
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
