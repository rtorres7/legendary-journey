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
          <!-- Profile dropdown -->
          <Menu as="div" class="hidden lg:block ml-3 relative text-gray-600">
            <div>
              <tippy content="User Menu">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-none focus:ring-gray-600"
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
                class="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-semibold border-x border-b border-slate-700/50"
              >
                <MenuItem>
                  <router-link
                    to="/"
                    class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80"
                  >
                    Alvaro Ramirez
                  </router-link>
                </MenuItem>
                <MenuItem>
                  <a
                    class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80"
                    target="_blank"
                    >User Support
                  </a>
                </MenuItem>
                <template v-if="environment === 'offline'">
                  <MenuItem>
                    <a
                      class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80"
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
