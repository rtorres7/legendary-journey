<template>
  <MaxCard
    :class="['h-full', loading ? 'animate-pulse' : '']"
    :alternate="!loading && isProductLocked(product)"
    :aria-label="
      !loading && isProductLocked(product) ? 'restricted product' : ''
    "
    :title="
      !loading && isProductLocked(product)
        ? 'This product has restricted access.'
        : ''
    "
    :hoverable="!loading && !isProductLocked(product) ? true : false"
    :rounded="false"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <template v-if="loading">
      <div
        :class="[
          headline ? 'h-[45%]' : 'h-2/3',
          'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700',
        ]"
      ></div>
      <div
        :class="[
          headline ? 'h-[55%] pt-4 px-4' : 'h-1/3 pt-4 xl:pt-2 px-4',
          'flex flex-col justify-between ',
        ]"
      >
        <div>
          <h1
            :class="[
              headline ? 'h-24 md:h-20' : 'h-6',
              'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded',
            ]"
          ></h1>
          <p
            v-show="headline"
            class="hidden md:block mt-4 h-12 xl:h-16 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded"
          ></p>
        </div>
        <p
          :class="[
            headline ? 'mb-2' : 'mb-2 xl:mt-1',
            'h-5 w-1/2 self-center bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700 rounded',
          ]"
        ></p>
      </div>
    </template>
    <template v-else>
      <ProductImage
        :class="[headline ? 'h-[45%]' : 'h-2/3']"
        :product="product"
      />
      <div
        :class="[
          headline ? 'h-[55%] pt-4' : 'h-1/3 pt-2',
          'relative flex flex-col justify-between px-4',
        ]"
      >
        <div
          v-if="environment !== 'production'"
          class="absolute top-0 right-0 cursor-pointer"
        >
          <Menu v-slot="{ open, close }" as="div" class="relative z-10">
            <div>
              <template v-if="open || hover">
                <template v-if="open">
                  <MenuButton
                    class="max-w-xs mt-2 rounded-full flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    @click.prevent
                  >
                    <span class="sr-only">More Options</span>
                    <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                  </MenuButton>
                </template>
                <template v-else>
                  <tippy content="More" placement="bottom">
                    <MenuButton
                      class="max-w-xs mt-2 rounded-full flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span class="sr-only">More Options</span>
                      <EllipsisVerticalIcon
                        class="h-6 w-6"
                        aria-hidden="true"
                      />
                    </MenuButton>
                  </tippy>
                </template>
              </template>
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
                class="origin-top-right absolute right-0 z-10 mt-2 w-48 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm bg-white dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b dark:border-slate-700/50 energy:border-zinc-700/50"
              >
                <MenuItem>
                  <div
                    class="py-2 px-3 flex items-center space-x-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                    @click.prevent="
                      save(product);
                      close();
                    "
                  >
                    <template v-if="isSavedProduct(product)">
                      <BookmarkIconSolid aria-hidden="true" class="h-5 w-5" />
                      <span class="capitalize">Saved</span>
                    </template>
                    <template v-else>
                      <BookmarkIcon class="h-5 w-5" aria-hidden="true" /><span
                        class="capitalize"
                        >Save</span
                      >
                    </template>
                  </div>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <ProductRestrictedLink :product="product">
          <div class="h-full flex flex-col justify-between">
            <div>
              <h1
                :class="[
                  headline
                    ? 'text-xl line-clamp-6 md:line-clamp-5 lg:line-clamp-4'
                    : 'line-clamp-2',
                  'text-black dark:text-slate-100 energy:text-zinc-100 text-center font-medium wrap-anywhere mx-2',
                ]"
                :title="product.title"
              >
                {{ `(${product.title_classification}) ${product.title}` }}
              </h1>
              <p
                v-show="headline"
                class="hidden mt-3 text-md md:line-clamp-4 lg:line-clamp-5 wrap-anywhere"
                :title="product.summary"
              >
                {{ `(${product.summary_classification}) ${product.summary}` }}
              </p>
            </div>
            <p
              :class="[
                headline ? '' : 'xl:mt-1',
                'mb-4 text-center text-sm text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80',
              ]"
            >
              {{ formatDate(product.date_published) }}
            </p>
          </div>
        </ProductRestrictedLink>
        <template v-if="isProductLocked(product)">
          <MaxProductIcon
            class="absolute w-12 h-12 m-auto bottom-0 right-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
            icon="locked"
          />
        </template>
      </div>
    </template>
  </MaxCard>
</template>
<script>
import { ref } from "vue";
import { BookmarkIcon, EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { isProductLocked, formatDate, isSavedProduct } from "@/shared/helpers";
import ProductImage from "@current/components/ProductImage.vue";
import updateSavedStatus from "@current/composables/updateSavedStatus";
import ProductRestrictedLink from "@current/components/ProductRestrictedLink.vue";

export default {
  components: {
    ProductImage,
    BookmarkIcon,
    BookmarkIconSolid,
    EllipsisVerticalIcon,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ProductRestrictedLink,
  },
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    headline: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const offlineMode = import.meta.env.MODE === "offline";
    const environment = ref(import.meta.env.MODE);
    const { save, savingProduct, removingProduct } = updateSavedStatus();
    const hover = ref(false);
    return {
      offlineMode,
      environment,
      isProductLocked,
      formatDate,
      isSavedProduct,
      save,
      savingProduct,
      removingProduct,
      hover,
    };
  },
};
</script>
