<template>
  <MaxCard
    :class="['relative h-full px-4 py-4', loading ? 'animate-pulse' : '']"
    :aria-label="
      !loading && isProductLocked(sitrep) ? 'restricted product' : ''
    "
    :title="
      !loading && isProductLocked(sitrep)
        ? 'This product has restricted access.'
        : ''
    "
    :alternate="!loading && isProductLocked(sitrep)"
    :hoverable="!loading && !isProductLocked(sitrep) ? true : false"
    :rounded="false"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <template v-if="loading">
      <div class="flex flex-col h-full justify-between">
        <div>
          <p
            class="h-5 w-28 mb-2 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
          ></p>
          <div
            class="h-8 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
          ></div>
        </div>
        <div
          class="h-6 w-28 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
        ></div>
      </div>
    </template>
    <template v-else>
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
                    @click.prevent
                  >
                    <span class="sr-only">More Options</span>
                    <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
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
              class="origin-top-right absolute right-0 z-10 mt-2 w-48 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm bg-white dark:bg-slate-800 energy:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b dark:border-slate-700/50 energy:border-zinc-700/50"
            >
              <MenuItem>
                <div
                  class="py-2 px-3 flex items-center space-x-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                  @click.prevent="
                    save(sitrep);
                    close();
                  "
                >
                  <template v-if="isSavedProduct(sitrep)">
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
      <ProductRestrictedLink :product="sitrep">
        <div class="flex flex-col h-full justify-between">
          <div>
            <p class="text-sm mb-2 line-clamp-2">
              {{ sitrep.product_type_name }}
            </p>
            <p class="line-clamp-2 font-medium text-lg" :title="sitrep.title">
              ({{ sitrep.title_classification }}) {{ sitrep.title }}
            </p>
          </div>
          <div
            class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
          >
            Posted {{ formatDate(sitrep.date_published) }}
          </div>
        </div>
      </ProductRestrictedLink>
      <template v-if="isProductLocked(sitrep)">
        <MaxProductIcon
          class="absolute w-10 h-10 m-auto bottom-0 right-0 text-mission-blue/20 dark:text-slate-300/20 energy:text-zinc-300/20"
          icon="locked"
        />
      </template>
    </template>
  </MaxCard>
</template>

<script>
import { ref } from "vue";
import { BookmarkIcon, EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { isProductLocked, formatDate, isSavedProduct } from "@/shared/helpers";
import updateSavedStatus from "@current/composables/updateSavedStatus";
import ProductRestrictedLink from "@current/components/ProductRestrictedLink.vue";

export default {
  components: {
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
    sitrep: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const environment = ref(import.meta.env.MODE);
    const { save } = updateSavedStatus();
    const hover = ref(false);

    return {
      formatDate,
      isProductLocked,
      environment,
      isSavedProduct,
      save,
      hover,
    };
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
