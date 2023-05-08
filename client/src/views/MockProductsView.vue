<template>
  <div class="h-full flex">
    <div class="bg-slate-900 min-h-screen w-20">
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
    <div class="flex flex-col h-screen w-full">
      <div
        class="h-16 px-8 border-b border-slate-900/10 shadow-sm flex justify-between items-center"
      >
        <div>Search</div>
        <div>
          <!-- Theme dropdown -->
          <Menu as="div" class="hidden lg:block relative">
            <div>
              <tippy content="Themes">
                <MenuButton
                  class="max-w-xs flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  :class="
                    selectedTheme === 'system'
                      ? 'text-slate-400'
                      : 'text-amber-300 dark:text-teal-400 energy:text-energy-yellow'
                  "
                >
                  <span class="sr-only"
                    >Open menu for toggling color palettes.</span
                  >
                  <template v-if="selectedTheme === 'dark'">
                    <MoonIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else-if="selectedTheme === 'energy'">
                    <BoltIcon class="h-6 w-6" aria-hidden="true" />
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
                class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-semibold bg-mission-blue/95 dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b border-slate-700/50 energy:border-zinc-700/50"
              >
                <MenuItem v-for="item in themeOptions" :key="item">
                  <a
                    :class="isActive(item)"
                    class="py-1 px-2 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80 flex items-center space-x-2 cursor-pointer"
                    @click="changeTheme(item)"
                  >
                    <template v-if="item === 'light'">
                      <SunIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'dark'">
                      <MoonIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'energy'">
                      <BoltIcon class="h-6 w-6" aria-hidden="true" />
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
          <!-- Profile dropdown -->
          <Menu as="div" class="hidden lg:block ml-3 relative">
            <div>
              <tippy content="User Menu">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-none focus:ring-gray-600"
                >
                  <span class="sr-only">Open user menu.</span>
                  <UserCircleIcon class="h-8 w-8" aria-hidden="true" />
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
                class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-black ring-opacity-5 focus:outline-none text-sm"
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
      </div>
      <div class="p-10">
        <p class="font-semibold text-2xl">Alvaro's Dashboard</p>
        <p class="hidden xl:block">XL Mode 1280 px</p>
        <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
        <p class="hidden md:block lg:hidden">MD Mode 768px</p>
        <p class="hidden sm:block md:hidden">SM Mode 640px</p>
        <p class="block sm:hidden">Less than SM mode</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  BookmarkIcon,
  FolderIcon,
  HomeIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BookmarkIcon,
    FolderIcon,
    HomeIcon,
    StarIcon,
    UserCircleIcon,
  },
  setup() {},
};
</script>
<style lang="scss"></style>
