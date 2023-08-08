<template>
  <div
    class="relative flex flex-col bg-white shadow-md hover:shadow-lg rounded max-w-[450px] p-8"
  >
    <div
      v-if="loading"
      class="h-[100px] loading animate-pulse pt-4 xl:pt-2 px-4 flex flex-col gap-y-6"
    >
      <p class="mb-2 xl:mt-1 h-5 w-1/2 bg-slate-200"></p>
      <h1 class="h-6 bg-slate-200 rounded"></h1>
    </div>
    <div v-else class="relative h-32">
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
              <!-- <MenuItem>
                <div
                  class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                >
                  <ShareIcon class="h-5 w-5" aria-hidden="true" /><span
                    class="capitalize"
                    >Share</span
                  >
                </div>
              </MenuItem> -->
              <MenuItem v-if="product.featureId">
                <router-link
                  :to="{
                    name: 'edit',
                    params: {
                      date: dayjs(product.datePublished).format('YYYY-MM-DD'),
                      id: product.featureId,
                      doc_num: product.productNumber,
                    },
                  }"
                >
                  <div
                    class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                  >
                    <PencilSquareIcon class="h-5 w-5" aria-hidden="true" /><span
                      class="capitalize"
                      >Edit</span
                    >
                  </div>
                </router-link>
              </MenuItem>
              <MenuItem v-if="product.featureId">
                <div
                  class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                  @click="deleteProduct"
                >
                  <TrashIcon class="h-5 w-5" aria-hidden="true" /><span
                    class="capitalize"
                    >Delete</span
                  >
                </div>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
      <div class="cursor-pointer hover:underline">
        <router-link
          :to="{
            name: product.state === 'draft' ? 'product-preview' : 'product',
            params: { doc_num: product.productNumber },
          }"
        >
          <div class="flex items-center space-x-4">
            <ProductIcon
              class="w-8 h-8"
              :class="getIconColor(productIcon)"
              :icon="productIcon"
            />
            <div class="text-xs text-gray-500">
              {{ product.productType.name }}
            </div>
          </div>
          <p
            class="font-semibold text-gray-700 line-clamp-2 mt-4"
            :title="`${product.titleClassification} ${product.title}`"
          >
            <span
              v-if="product.titleClassification"
              class="font-medium text-gray-500"
              >({{ product.titleClassification }})</span
            >
            {{ product.title }}
          </p>
          <div class="text-sm text-gray-500 mt-4 absolute bottom-0">
            {{ dayjs(product.createdAt).utc().format("DD MMMM YYYY") }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import ProductIcon from "./ProductIcon.vue";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    ShareIcon,
    TrashIcon,
    ProductIcon,
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
    loading: {
      type: Boolean,
      default: false,
    },
    productIcon: {
      type: String,
      default: "wave",
    },
  },
  emits: ["delete"],
  setup(props, { emit }) {
    const deleteProduct = () => {
      emit("delete", props.product);
    };
    const icons = [
      {
        name: "wave",
        color: "blue",
      },
      {
        name: "briefcase",
        color: "purple",
      },
      {
        name: "community",
        color: "green",
      },
      {
        name: "ebook",
        color: "blue",
      },
      {
        name: "reading",
        color: "blue",
      },
      {
        name: "globe",
        color: "green",
      },
      {
        name: "analytics-plus",
        color: "red",
      },
      {
        name: "phone",
        color: "purple",
      },
      {
        name: "file",
        color: "red",
      },
      {
        name: "news",
        color: "red",
      },
      {
        name: "analytics",
        color: "red",
      },
    ];
    const getIconColor = (iconName) => {
      let icon = icons.find((icon) => icon.name == iconName);
      if (icon) {
        return `text-${icon.color}-500`;
      } else {
        return "text-green-500";
      }
    };
    return {
      deleteProduct,
      icons,
      getIconColor,
      dayjs,
      utc,
    };
  },
};
</script>
<style></style>
