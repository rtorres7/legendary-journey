<template>
  <div
    class="hidden xl:flex flex-col max-w-[464px] bg-white shadow-md hover:shadow-lg"
  >
    <div class="max-h-[261px]">
      <img :src="getImg(issue.src)" alt="" />
    </div>
    <div class="relative py-4 px-6">
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
                <div
                  class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                >
                  <PencilSquareIcon class="h-5 w-5" aria-hidden="true" /><span
                    class="capitalize"
                    >Edit</span
                  >
                </div>
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
        <div class="flex items-center space-x-2 text-gray-500">
          <div
            class="flex items-center space-x-2 uppercase text-xs font-medium"
          >
            <ClockIcon class="h-5 w-5" aria-hidden="true" />
            <span>Posts in {{ issue.posting_date }}</span>
          </div>
          <!-- <div>•</div>
                      <div class="text-xs uppercase">Issue STU-0076</div> -->
        </div>
        <!-- <div
                      class="flex items-center space-x-2 uppercase text-xs font-medium"
                    >
                      <ClockIcon class="h-5 w-5" aria-hidden="true" />
                      <span>Posts in 4 days</span>
                    </div> -->
        <div>
          <!-- <span class="text-gray-400 text-xs uppercase"
                        >Issue STU-0076</span
                      > -->
          <div class="text-xl font-semibold py-2">{{ issue.title }}</div>
          <p class="font-medium text-gray-500 text-sm">By {{ issue.author }}</p>
        </div>
        <div class="pt-4">
          <div class="text-xs text-red-800 uppercase py-2 tracking-wider">
            Top <span class="text-gray-700">Product</span>
          </div>
          <div class="text-sm line-clamp-2">
            <span class="text-gray-500">{{
              issue.featured.classification
            }}</span>
            {{ issue.featured.title }}
          </div>
        </div>
        <!-- <div class="py-2">
                      <div
                        class="text-xs text-red-800 uppercase py-1 tracking-wider"
                      >
                        Featured
                        <span class="text-gray-700">Content</span>
                      </div>
                      <ul class="text-xs text-gray-700">
                        <li
                          class="border-b border-dotted border-gray-300 text-base font-medium py-2"
                        >
                          <div class="line-clamp-1">
                            <span class="text-gray-500">(U)</span> Ukraine
                            Claims Gains Near Bakhmut as Deadly Fighting
                            Continues
                          </div>
                        </li>
                        <li class="border-b border-dotted border-gray-300 py-2">
                          <div class="line-clamp-1">
                            (U) Deciphering Vladimir Putin's many appearances
                            since mutiny
                          </div>
                        </li>
                        <li class="py-2">
                          <div class="line-clamp-1">
                            (U) Analysis: Putin expected to meet Xi Jinping and
                            other world leaders for first time since Wagner
                            insurrection Analysis: Putin expected to meet Xi
                            Jinping and other world leaders for first time since
                            Wagner insurrection
                          </div>
                        </li>
                      </ul>
                    </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  ClockIcon,
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
    ClockIcon,
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
      return new URL("../../assets/mocks/" + src, import.meta.url).href;
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
