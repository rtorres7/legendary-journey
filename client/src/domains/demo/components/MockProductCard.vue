<template>
  <div
    class="flex flex-col bg-white rounded-md max-w-[464px] shadow-md hover:shadow-lg cursor-pointer mb-2"
  >
    <div class="max-h-[261px]">
      <img :src="getImg(product.src)" alt="" />
    </div>
    <div class="h-full flex flex-col py-4 justify-between">
      <div class="relative pb-6 px-4">
        <div class="text-xs text-blue-700 font-medium pb-2">
          {{ product.type }}
        </div>
        <p
          class="font-semibold text-gray-700 line-clamp-3"
          :title="`${product.classification} ${product.title}`"
        >
          <span class="font-medium text-gray-500">{{
            product.classification
          }}</span>
          {{ product.title }}
        </p>
        <div class="text-gray-500 hover:text-gray-900 absolute top-0 right-0">
          <Menu as="div" class="relative">
            <div>
              <tippy content="More" placement="bottom" theme="demo">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <span class="sr-only">More Options</span>
                  <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
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
                    <ShareIcon class="h-5 w-5" aria-hidden="true" /><span
                      class="capitalize"
                      >Share</span
                    >
                  </div>
                </MenuItem>
                <template v-if="type === 'product' || type === 'favorites'">
                  <MenuItem>
                    <div
                      class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                    >
                      <BookmarkIcon class="h-5 w-5" aria-hidden="true" /><span
                        class="capitalize"
                        >Save</span
                      >
                    </div>
                  </MenuItem>
                </template>
                <template v-if="type !== 'favorites'">
                  <MenuItem>
                    <div
                      class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                    >
                      <StarIcon class="h-5 w-5" aria-hidden="true" /><span
                        class="capitalize"
                        >Favorite</span
                      >
                    </div>
                  </MenuItem>
                </template>
                <template v-if="type === 'saved' || type === 'favorites'">
                  <MenuItem>
                    <div
                      class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                    >
                      <XMarkIcon class="h-5 w-5" aria-hidden="true" /><span
                        class="capitalize"
                        >Remove</span
                      >
                    </div>
                  </MenuItem>
                </template>
                <template v-if="type === 'product'">
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
                      <TrashIcon class="h-5 w-5" aria-hidden="true" /><span
                        class="capitalize"
                        >Delete</span
                      >
                    </div>
                  </MenuItem>
                </template>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <div class="px-4 text-sm text-gray-500">
        <div class="flex space-x-2">
          <div>{{ product.date_posted }}</div>
          <div>•</div>
          <div>{{ product.views }} views</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BookmarkIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    ShareIcon,
    StarIcon,
    TrashIcon,
    XMarkIcon,
  },
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "product",
    },
  },
  setup() {
    const getImg = (src) => {
      //return new URL("../../../shared/assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../../shared/assets/mocks/${src}`, import.meta.url)
        .href;
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
