<template>
  <div class="flex flex-col max-w-[675px] bg-white shadow-md hover:shadow-lg">
    <div class="max-h-[380px] cursor-pointer">
      <img :src="getImg(issue.src)" alt="" />
    </div>
    <div class="relative py-4 px-6 h-full">
      <div class="text-gray-500 hover:text-gray-900 absolute top-3 right-3">
        <Menu as="div" class="relative">
          <div>
            <tippy content="More" placement="bottom" theme="studio">
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
      <div class="flex flex-col">
        <div>
          <template v-if="issue.live"
            ><div class="flex items-center space-x-2">
              <span class="relative flex h-[.4em] w-[.4rem]">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-[.4rem] w-[.4rem] bg-red-500"
                ></span>
              </span>
              <span class="text-xs font-semibold tracking-wider uppercase"
                >Live Now</span
              >
            </div></template
          >
          <template v-else>
            <div
              class="flex items-center space-x-2 text-gray-500 uppercase text-xs font-medium"
            >
              <ClockIcon class="h-5 w-5" aria-hidden="true" />
              <span>Posts in {{ issue.posting_date }}</span>
            </div>
          </template>
          <p
            class="text-xl py-2 hover:underline underline-offset-2 decoration-1 decoration-gray-500 font-semibold cursor-pointer"
          >
            {{ issue.title }}
          </p>
          <p class="font-medium text-sm">By {{ issue.author }}</p>
        </div>
        <div class="pt-4">
          <div
            class="text-xs text-blue-700 uppercase py-2 tracking-wider font-medium"
          >
            Top <span class="text-gray-500">Product</span>
          </div>
          <div class="text-sm line-clamp-2 hover:underline cursor-pointer">
            <span class="text-gray-500">{{
              issue.featured[0].classification
            }}</span>
            {{ issue.featured[0].title }}
          </div>
        </div>
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
      //return new URL("../../assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../assets/mocks/${src}`, import.meta.url).href;
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
