<template>
  <div>
    <div class="text-2xl text-gray-700">{{ currentUsername }}'s Workspace</div>
    <div class="py-6 flex items-center">
      <div class="text-lg font-bold">Continue where you left off</div>
    </div>
    <template v-if="loadingDrafts == true">
      <MaxLoadingSpinner class="h-16 w-16"
    /></template>
    <template v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="product in myDrafts" :key="product">
          <MyDraftProductCard :product="product" type="product" />
        </template>
      </div>
    </template>
    <div class="py-6 flex justify-between items-center">
      <div class="text-lg font-bold">My Recent Products</div>
      <a
        class="flex items-center text-gray-500 text-sm font-semibold"
        href="/workspace#products"
      >
        <span>More Products</span>
        <ChevronRightIcon class="h-4 w-4" />
      </a>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
    >
      <MyPublishedProductCard :product="products[0]" type="product" />
      <MyPublishedProductCard :product="products[1]" type="product" />
      <MyPublishedProductCard
        :product="products[2]"
        type="product"
        class="hidden lg:flex"
      />
      <MyPublishedProductCard
        :product="products[3]"
        type="product"
        class="hidden 2xl:flex"
      />
    </div>
    <div class="py-6 flex items-center">
      <div class="text-lg font-bold">Your Stats</div>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
    >
      <div
        class="flex justify-between border border-slate-300/70 shadow-sm rounded px-6 py-4 max-w-[464px]"
      >
        <div class="flex space-x-4 items-center text-slate-500">
          <Square3Stack3DIcon class="h-5 w-5" />
          <span class="text-sm font-normal"> Total Created</span>
        </div>
        <div class="font-semibold text-xl text-slate-700">16</div>
      </div>
      <div
        class="flex justify-between border border-slate-300/70 shadow-sm rounded px-6 py-4 max-w-[464px]"
      >
        <div class="flex space-x-4 items-center text-slate-500">
          <EyeIcon class="h-5 w-5" />
          <span class="text-sm font-normal">Total Views</span>
        </div>
        <div class="font-semibold text-xl text-slate-700">2.4m</div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "@/config/wireAxios";
import MyDraftProductCard from "./MyDraftProductCard.vue";
import MyPublishedProductCard from "./MyPublishedProductCard.vue";
import {
  products,
  savedProducts,
  favoriteProducts,
  collectionProducts,
} from "@/demo/data";

import {
  ChevronRightIcon,
  EyeIcon,
  Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";

export default {
  components: {
    MyDraftProductCard,
    MyPublishedProductCard,
    ChevronRightIcon,
    EyeIcon,
    Square3Stack3DIcon,
  },
  setup() {
    const store = useStore();
    const currentUsername = computed(() => store.state.user.user.name);
    const myDrafts = ref([]);
    const myProducts = ref([]);
    const loadingDrafts = ref(true);
    const loadingProducts = ref(true);

    onMounted(() => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          //offline drafts don't exist yet
          console.log("/drafts: ", products);
          myDrafts.value = products;
          loadingDrafts.value = false;
        }, 1000);
      } else {
        axios.get("workspace/drafts").then((response) => {
          loadingDrafts.value = false;
          if (response.data) {
            myDrafts.value = response.data.content;
          } else {
            console.log("Couldn't retrieve drafts");
          }
        });
      }
    });

    return {
      products,
      savedProducts,
      favoriteProducts,
      collectionProducts,
      currentUsername,
      myDrafts,
      myProducts,
      loadingDrafts,
      loadingProducts,
    };
  },
};
</script>
<style></style>
