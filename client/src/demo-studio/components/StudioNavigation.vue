<template>
  <div class="h-full flex">
    <!-- Less than sm -->
    <div
      class="w-full flex md:hidden justify-between items-center h-16 px-8 border-b bg-white text-gray-900 z-[5]"
    >
      <div class="flex">
        <button
          type="button"
          class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          @click="open"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <router-link
          to="/"
          class="text-blue-700 ml-6 flex mx-auto items-center"
        >
          <div class="rounded-full bg-blue-200 p-2">
            <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
          </div>
          <span class="ml-3 font-bold text-2xl">Studio</span>
        </router-link>
      </div>
      <div class="flex">
        <div class="flex space-x-4 px-4">
          <button
            class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <span class="sr-only">Search</span>
            <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <!-- Admin Dropdown -->
          <Menu as="div" class="block md:hidden relative">
            <div>
              <tippy content="Admin" theme="demo">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          <Menu as="div" class="block md:hidden relative">
            <div>
              <tippy content="Themes" theme="demo">
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
          <Menu as="div" class="block md:hidden relative">
            <div>
              <tippy content="User Menu" theme="demo">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
    <!--- md to xl --->
    <div
      class="hidden md:block 2xl:hidden bg-white border-r border-slate-900/10 min-h-screen min-w-[80px]"
    >
      <div class="flex flex-col">
        <div class="flex justify-center items-center py-6">
          <router-link to="/">
            <div class="rounded-full bg-blue-200 p-3">
              <VideoCameraIconSolid
                class="h-6 w-6 text-blue-700"
                aria-hidden="true"
              />
            </div>
          </router-link>
        </div>
        <ul class="pl-4 py-4 text-gray-500 space-y-1">
          <li>
            <tippy content="Home   " placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#home')
                    ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                    : 'hover:text-blue-700'
                "
                class="cursor-pointer"
              >
                <a
                  href="/studio#home"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <template v-if="isActivePage('#home')">
                    <HomeIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <HomeIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Live Content" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#live')
                    ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                    : 'hover:text-blue-700'
                "
                class="cursor-pointer"
              >
                <a
                  href="/studio#live"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <template v-if="isActivePage('#live')">
                    <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Issues" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#issues')
                    ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                    : 'hover:text-blue-700'
                "
                class="cursor-pointer"
              >
                <a
                  href="/studio#issues"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <template v-if="isActivePage('#issues')">
                    <NewspaperIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                </a>
              </div>
            </tippy>
          </li>
        </ul>
      </div>
    </div>
    <!--- 2xl or higher --->
    <div
      class="hidden 2xl:block bg-white border-r border-slate-900/10 min-h-screen min-w-[275px]"
    >
      <div class="flex flex-col">
        <div class="text-blue-700 flex px-4 py-6">
          <router-link to="/" class="flex items-center px-4">
            <div class="rounded-full bg-blue-200 p-3">
              <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
            </div>
            <span class="ml-4 font-bold text-3xl">Studio</span>
          </router-link>
        </div>
        <div class="text-gray-400 font-medium px-8 py-2">Menu</div>
        <ul class="pl-6 py-4 font-medium text-gray-500 space-y-2">
          <li>
            <div>
              <a href="/studio#home">
                <div
                  :class="
                    isActivePage('#home')
                      ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                      : 'hover:text-blue-700'
                  "
                  class="flex items-center px-4 py-3 cursor-pointer"
                >
                  <template v-if="isActivePage('#home')">
                    <HomeIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <HomeIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <span class="ml-4 font-medium">Home</span>
                </div>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="/studio#live" class="">
                <div
                  :class="
                    isActivePage('#live')
                      ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                      : 'hover:text-blue-700'
                  "
                  class="flex items-center px-4 py-3 cursor-pointer"
                >
                  <template v-if="isActivePage('#live')">
                    <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <span class="ml-4 font-medium">Live Content</span>
                </div>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="/studio#issues" class="">
                <div
                  :class="
                    isActivePage('#issues')
                      ? 'text-blue-700 bg-blue-500/10 rounded-l-lg border-r border-r-blue-700'
                      : 'hover:text-blue-700'
                  "
                  class="flex items-center px-4 py-3 cursor-pointer"
                >
                  <template v-if="isActivePage('#issues')">
                    <NewspaperIconSolid class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else>
                    <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <span class="ml-4 font-medium">Issues</span>
                </div>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Dialog (Mobile Only)-->
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="block md:hidden" @close="close">
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
              class="relative min-h-screen w-72 max-w-calc[(100%-3rem)] p-6 text-left align-top transition-all transform text-gray-500 bg-white shadow-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center hover:text-gray-700"
                tabindex="0"
                @click="close"
              >
                <span class="sr-only">Close main menu</span
                ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="text-blue-700 flex flex-col py-6">
                <div class="flex">
                  <router-link to="/" class="ml-4 flex mx-auto items-center">
                    <div class="rounded-full bg-blue-200 p-3">
                      <VideoCameraIconSolid
                        class="h-6 w-6"
                        aria-hidden="true"
                      />
                    </div>
                    <span class="ml-3 font-bold text-3xl">Studio</span>
                  </router-link>
                </div>
              </div>
              <div class="text-gray-400 font-medium py-2 px-4">Menu</div>
              <ul class="py-4 pl-4 font-medium text-gray-500 space-y-2">
                <li>
                  <div>
                    <a href="/studio#home" class="">
                      <div
                        :class="
                          isActivePage('#home')
                            ? 'text-blue-700 bg-blue-500/10 '
                            : 'hover:text-blue-700 '
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <template v-if="isActivePage('#home')">
                          <HomeIconSolid class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else>
                          <HomeIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <span class="ml-4">Dashboard</span>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <a href="/studio#live" class="">
                      <div
                        :class="
                          isActivePage('#live')
                            ? 'text-blue-700 bg-blue-500/10 '
                            : 'hover:text-blue-700 '
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <template v-if="isActivePage('#live')">
                          <VideoCameraIconSolid
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <span class="ml-4">Live Content</span>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <a href="/studio#issues" class="">
                      <div
                        :class="
                          isActivePage('#issues')
                            ? 'text-blue-700 bg-blue-500/10 '
                            : 'hover:text-blue-700 '
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <template v-if="isActivePage('#issues')">
                          <NewspaperIconSolid
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <span class="ml-4">Issues</span>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  ComputerDesktopIcon,
  HomeIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  VideoCameraIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  HomeIcon as HomeIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
} from "@heroicons/vue/24/solid";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    Bars3Icon,
    ComputerDesktopIcon,
    HomeIcon,
    HomeIconSolid,
    NewspaperIcon,
    NewspaperIconSolid,
    MagnifyingGlassIcon,
    MoonIcon,
    SunIcon,
    UserCircleIcon,
    VideoCameraIcon,
    VideoCameraIconSolid,
    WrenchIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isOpen = ref(false);
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
      window.location.hash = window.location.hash || "#home";
    });

    const close = () => {
      isOpen.value = false;
    };

    const open = () => {
      isOpen.value = true;
    };

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

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

    return {
      themeOptions,
      searches,
      loading,
      isDark,
      selectedTheme,
      isOpen,
      open,
      close,
      changeTheme,
      isActiveTheme,
      selectItemEventHandler,
      isActivePage,
    };
  },
};
</script>
<style lang="scss"></style>
