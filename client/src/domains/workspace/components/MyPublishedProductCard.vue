<template>
  <div
    class="flex flex-col bg-white rounded-md relative max-w-[464px] h-full shadow-md hover:shadow-lg mb-2"
  >
    <template v-if="loading">
      <div class="animate-pulse min-h-[370px] max-h-[555px]">
        <div
          class="h-[190px] sm:h-[150px] md:h-[187px] lg:h-[157px] xl:h-[205px] 2xl:h-[186px] w-full bg-slate-200"
        ></div>
        <div class="h-[150px] pt-4 px-4 flex flex-col justify-between">
          <div>
            <h1 class="h-6 bg-slate-200 rounded mb-2"></h1>
            <h2 class="h-6 bg-slate-200 rounded"></h2>
          </div>
          <p class="mb-2 xl:mt-1 h-5 w-1/2 bg-slate-200 rounded"></p>
        </div>
      </div>
    </template>
    <template v-else>
      <div id="img-container" class="cursor-pointer max-h-[261px]">
        <router-link
          :to="{
            name: product.state === 'draft' ? 'product-preview' : 'product',
            params: { doc_num: product.productNumber },
          }"
        >
          <ProductImage :product="product" />
        </router-link>
      </div>
      <div class="flex flex-col py-6 justify-between">
        <div class="relative pb-6 px-4">
          <div
            class="text-gray-500 hover:text-gray-900 absolute top-0 right-0 cursor-pointer"
          >
            <Menu as="div" class="relative z-10">
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
                  <template v-if="type === 'product' || type === 'favorites'">
                    <MenuItem>
                      <div
                        class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        @click="saveProduct(product)"
                      >
                        <BookmarkIcon class="h-5 w-5" aria-hidden="true" /><span
                          class="capitalize"
                          >Save</span
                        >
                      </div>
                    </MenuItem>
                  </template>
                  <template v-if="type === 'saved' || type === 'favorites'">
                    <MenuItem>
                      <div
                        class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        @click="removeSavedProduct"
                      >
                        <XMarkIcon class="h-5 w-5" aria-hidden="true" /><span
                          class="capitalize"
                          >Remove</span
                        >
                      </div>
                    </MenuItem>
                  </template>
                  <template v-if="type === 'product'">
                    <MenuItem v-if="product.featureId">
                      <router-link
                        :to="{
                          name: 'edit',
                          params: {
                            date: dayjs(product.datePublished).format(
                              'YYYY-MM-DD'
                            ),
                            id: product.featureId,
                            doc_num: product.productNumber,
                          },
                        }"
                      >
                        <div
                          class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        >
                          <PencilSquareIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                          /><span class="capitalize">Edit</span>
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
                  </template>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <router-link
            class="hover:underline cursor-pointer"
            :to="{
              name: product.state === 'draft' ? 'product-preview' : 'product',
              params: { doc_num: product.productNumber },
            }"
          >
            <div class="text-xs text-blue-700 font-medium pb-2">
              {{ product.productType.name }}
            </div>
            <p
              class="font-semibold text-gray-700 line-clamp-3"
              :title="`${product.titleClassification} ${product.title}`"
            >
              <span class="font-medium text-gray-500"
                >({{ product.titleClassification }})</span
              >
              {{ product.title }}
            </p>
          </router-link>
        </div>
        <router-link
          class="hover:underline cursor-pointer absolute bottom-0"
          :to="{
            name: product.state === 'draft' ? 'product-preview' : 'product',
            params: { doc_num: product.productNumber },
          }"
        >
          <div class="px-4 text-sm text-gray-500 pb-4">
            <div class="flex space-x-2">
              <div>
                {{ dayjs(product.datePublished).format("YYYY-MM-DD") }}
              </div>
              <!-- <div>•</div>
                <div>{{ product.views }} views</div> -->
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </div>
  <Overlay :show="savingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Saving Product...</p>
      <div class="w-fit m-auto">
        <LoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </Overlay>
</template>
<script>
import { inject, ref } from "vue";
import axios from "@/shared/config/wireAxios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import Overlay from "./Overlay.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import ProductImage from "@workspace/components/ProductImage.vue";
import dayjs from "dayjs/esm/index.js";
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
    TrashIcon,
    XMarkIcon,
    ProductImage,
    Overlay,
    LoadingSpinner,
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
  },
  emits: ["delete", "remove"],
  setup(props, { emit }) {
    const environment = ref(import.meta.env.MODE);
    const createNotification = inject("create-notification");
    const getImg = (src) => {
      return new URL("/src/assets/mocks/" + src, import.meta.url).href;
    };
    const deleteProduct = () => {
      emit("delete", props.product);
    };
    const removeSavedProduct = () => {
      emit("remove", props.product);
    };
    const savingProduct = ref(false);
    const saveProduct = (product) => {
      if (import.meta.env.MODE === "offline") {
        createNotification({
          title: "Product Saved",
          message: `Product ${product.productNumber} has been saved.`,
          type: "success",
        });
      } else {
        savingProduct.value = true;
        axios.put("/workspace/saved/" + product.productId).then((response) => {
          if (response.data.error) {
            savingProduct.value = false;
            createNotification({
              title: "Error",
              message: response.data.error,
              type: "error",
              autoClose: false,
            });
          } else {
            savingProduct.value = false;
            createNotification({
              title: "Product Saved",
              message: `Product ${product.productNumber} has been saved.`,
              type: "success",
            });
          }
        });
      }
    };
    return {
      environment,
      getImg,
      deleteProduct,
      removeSavedProduct,
      savingProduct,
      saveProduct,
      dayjs,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
