<template>
  <div
    class="flex flex-col max-w-[720px] xl:max-w-[1280px] xl:flex-row xl:max-h-[360px] bg-white shadow-md hover:shadow-lg"
  >
    <div
      class="max-h-[405px] xl:max-h-none max-w-none xl:max-w-[640px] cursor-pointer"
    >
      <img :src="getImg(issue.src)" alt="" />
    </div>
    <div class="relative p-6">
      <div class="text-gray-500 hover:text-gray-900 absolute top-3 right-3">
        <Menu as="div" class="relative">
          <div>
            <tippy content="More" placement="bottom" theme="demo">
              <MenuButton
                class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <span class="sr-only">More Options</span>
                <EllipsisHorizontalIcon class="h-6 w-6" aria-hidden="true" />
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
                <router-link
                  class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                  :to="{
                    name: 'studio-issue-detail',
                    params: {
                      id: 'ci-500',
                    },
                  }"
                >
                  <PencilSquareIcon class="h-5 w-5" aria-hidden="true" /><span
                    class="capitalize"
                    >Edit</span
                  >
                </router-link>
              </MenuItem>
              <MenuItem>
                <div
                  class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                >
                  <ShareIcon class="h-5 w-5" aria-hidden="true" /><span
                    class="capitalize"
                    >Share</span
                  >
                </div>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
      <div class="flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center space-x-2">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
              ></span>
            </span>
            <span class="text-sm font-semibold tracking-wider uppercase"
              >Live Now</span
            >
          </div>
          <div class="text-3xl py-2 font-semibold">
            <router-link
              class="hover:underline underline-offset-2 decoration-2"
              to="/studio/live"
            >
              {{ issue.title }}
            </router-link>
          </div>
          <div class="flex flex-col py-1 space-y-2 font-medium text-sm">
            <p>By {{ issue.author }}</p>
            <p class="text-gray-400">Updated {{ issue.last_updated }}</p>
          </div>
        </div>
        <div class="py-2">
          <div
            class="text-xs uppercase text-gray-500 py-1 tracking-wider font-medium"
          >
            Featured Products
          </div>
          <ul class="text-xs text-gray-700">
            <li
              class="border-b border-dotted border-gray-300 text-base font-medium py-2"
            >
              <div class="line-clamp-2 hover:underline cursor-pointer">
                <span class="text-gray-500">{{
                  issue.featured[0].classification
                }}</span>
                {{ issue.featured[0].title }}
              </div>
            </li>
            <li class="border-b border-dotted border-gray-300 py-2">
              <div class="line-clamp-1 hover:underline cursor-pointer">
                {{ issue.featured[1].classification }}
                {{ issue.featured[1].title }}
              </div>
            </li>
            <li class="py-2">
              <div class="line-clamp-1 hover:underline cursor-pointer">
                {{ issue.featured[2].classification }}
                {{ issue.featured[2].title }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    ShareIcon,
  },
  props: {
    issue: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const getImg = (src) => {
      //return new URL("../../shared/assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../shared/assets/mocks/${src}`, import.meta.url).href;
    };

    return {
      getImg,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
