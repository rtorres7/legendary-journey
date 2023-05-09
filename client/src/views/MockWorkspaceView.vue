<template>
  <div class="h-full flex">
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
                class="text-gray-50 bg-slate-800/90 p-3 rounded cursor-pointer"
              >
                <HomeIcon class="h-6 w-6" aria-hidden="true" />
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Saved Products" placement="right">
              <div
                class="hover:text-gray-50 hover:bg-slate-800/90 p-3 hover:rounded cursor-pointer"
              >
                <BookmarkIcon class="h-6 w-6" aria-hidden="true" />
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Favorites" placement="right">
              <div
                class="hover:text-gray-50 hover:bg-slate-800/90 p-3 hover:rounded cursor-pointer"
              >
                <StarIcon class="h-6 w-6" aria-hidden="true" />
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Collections" placement="right">
              <div
                class="hover:text-gray-50 hover:bg-slate-800/90 p-3 hover:rounded cursor-pointer"
              >
                <FolderIcon class="h-6 w-6" aria-hidden="true" />
              </div>
            </tippy>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col min-h-screen w-full h-full">
      <div class="relative grow">
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
                        class="flex py-1 px-3 hover:bg-gray-100 cursor-pointer"
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
                        class="flex py-1 px-3 hover:bg-gray-100 cursor-pointer"
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
                        :class="isActive(item)"
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
                        class="flex cursor-pointer py-1 px-3 hover:bg-gray-100"
                      >
                        Alvaro Ramirez
                      </router-link>
                    </MenuItem>
                    <MenuItem>
                      <a
                        class="flex cursor-pointer py-1 px-3 hover:bg-gray-100"
                        target="_blank"
                        >User Support
                      </a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <!-- Profile dropdown -->
          </div>
        </div>
        <div
          class="flex flex-col p-8 text-gray-900 bg-slate-50 w-full min-h-[calc(100vh-4rem)] h-full items-center"
        >
          <div
            class="max-w-[450px] sm:max-w-[685px] lg:max-w-[950px] xl:max-w-[1100px] 2xl:max-w-[1500px] 3xl:max-w-[1600px] w-full"
          >
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
              <div class="text-lg font-bold">Recent Products</div>
              <div
                class="flex items-center text-gray-500 text-sm font-semibold"
              >
                <span>Saved Products</span>
                <ChevronRightIcon class="h-4 w-4" />
              </div>
            </div>
            <div
              class="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6"
            >
              <div
                class="bg-white rounded-md w-[432px] sm:w-[288px] md:w-[304px] lg:w-[288px] xl:w-[336px] 3xl:w-[368px] h-[432px] sm:h-[288px] md:h-[304px] lg:h-[288px] xl:h-[336px] 3xl:h-[368px] shadow-md"
              >
                <div
                  class="h-[243px] sm:h-[162px] md:h-[171px] lg:h-[162px] xl:h-[189px] 3xl:h-[207px] bg-slate-600"
                >
                  <img src="@/assets/mocks/16x9_001_astronaut.jpg" alt="" />
                </div>
                <div class="flex flex-col pt-3 px-3 justify-between">
                  <div class="pb-8">
                    <p class="font-medium text-gray-700">
                      <span class="text-gray-400">(U)</span> Astronaut Buzz
                      Aldrin named honorary brigadier general, member of Space
                      Force
                    </p>
                  </div>
                  <div class="flex justify-between text-sm text-gray-500">
                    <div>101k views</div>
                    <div>4 days ago</div>
                  </div>
                </div>
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
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  BookmarkIcon,
  ComputerDesktopIcon,
  FolderIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
  UserCircleIcon,
  WrenchIcon,
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
    ChevronRightIcon,
    ComputerDesktopIcon,
    FolderIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    StarIcon,
    SunIcon,
    UserCircleIcon,
    WrenchIcon,
  },
  setup() {
    const store = useStore();
    const isDark = ref(localStorage.getItem("theme") === "dark" ? true : false);
    if (localStorage.getItem("theme") === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    }
    const selectedTheme = ref(localStorage.getItem("theme"));

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

    watch(selectedTheme, (newTheme) => {
      changeTheme(newTheme);
    });

    const isActive = (selection) => {
      if (selection === localStorage.theme) {
        return "text-amber-600";
      }
    };

    return {
      dayjs,
      themeOptions,
      isDark,
      selectedTheme,
      changeTheme,
      isActive,
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
