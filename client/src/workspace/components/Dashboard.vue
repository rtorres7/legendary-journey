<template>
  <div>
    <div
      v-if="loadingUser"
      class="h-8 bg-slate-200 rounded mb-2 w-1/2 animate-pulse"
    ></div>
    <div v-if="!loadingUser" class="text-2xl text-gray-700">
      {{ currentUsername }}'s Workspace
    </div>
    <template v-if="!loadingDrafts && !loadingPublished">
      <template v-if="myDrafts.length > 0">
        <div class="py-6 flex items-center">
          <div class="text-lg font-bold">Continue where you left off</div>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <template v-for="(product, index) in myDrafts" :key="product">
            <MyDraftProductCard
              :product="product"
              :productIcon="getProductIcon(product)"
              type="product"
              :class="index < numCards ? 'block' : 'hidden'"
              @delete="deleteProduct(product)"
            />
          </template>
        </div>
      </template>
    </template>
    <div class="py-6 flex justify-between items-center">
      <div class="text-lg font-bold">My Recent Products</div>
      <a
        v-if="myPublished.length > 4"
        class="flex items-center text-gray-500 text-sm font-semibold"
        href="/workspace#products"
      >
        <span>More Products</span>
        <ChevronRightIcon class="h-4 w-4" />
      </a>
    </div>
    <template v-if="myPublished.length == 0 && !loadingPublished">
      <p class="italic">No published products to show</p>
    </template>
    <template v-if="loadingPublished">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="(card, index) in 4" :key="card">
          <MyPublishedProductCard
            :loading="true"
            :class="index < numCards ? 'block' : 'hidden'"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="(product, index) in myPublished" :key="product">
          <MyPublishedProductCard
            :product="product"
            type="product"
            :class="index < numCards ? 'block' : 'hidden'"
            @delete="deleteProduct(product)"
          />
        </template>
      </div>
    </template>
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
import { computed, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "@/config/wireAxios";
import MyDraftProductCard from "./MyDraftProductCard.vue";
import MyPublishedProductCard from "./MyPublishedProductCard.vue";
import { products } from "@/demo/data";
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
    const metadata = inject("metadata");
    const currentUsername = computed(() => store.state.user.user.name);
    const loadingUser = computed(() => store.state.user.loading);
    const myDrafts = ref([]);
    const myPublished = ref([]);
    const myStats = ref();
    const loadingDrafts = ref(true);
    const loadingPublished = ref(true);
    const loadingStats = ref(true);
    const createNotification = inject("create-notification");
    const deleteProduct = (product) => {
      axios.post("/documents/" + product.attributes.doc_num + "/deleteMe");
    };
    const getProductIcon = (product) => {
      const p = metadata.product_types.find(
        (p) => p.code == product.attributes.product_type
      );
      if (p.icon != null) {
        return p.icon;
      } else {
        return;
      }
    };
    const numCards = ref();
    const screenWidth = ref();
    const onScreenResize = () => {
      window.addEventListener("resize", () => {
        updateScreenWidth();
      });
    };
    const updateScreenWidth = () => {
      screenWidth.value = window.innerWidth;
      if (screenWidth.value < 640) {
        numCards.value = 1;
      } else if (screenWidth.value >= 640 && screenWidth.value < 1024) {
        numCards.value = 2;
      } else if (screenWidth.value >= 1024 && screenWidth.value < 1536) {
        numCards.value = 3;
      } else {
        numCards.value = 4;
      }
    };

    onMounted(() => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
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
        axios.get("workspace/recent").then((response) => {
          loadingPublished.value = false;
          if (response.data) {
            myPublished.value = response.data.content;
          } else {
            createNotification({
              title: "Error",
              message: "There was an error retrieving Recent Products.",
              type: "error",
              autoClose: false,
            });
          }
        });
        axios.get("workspace/stats").then((response) => {
          if (response.data) {
            myStats.value = response.data.content;
          } else {
            console.log("Couldn't retrieve stats");
          }
        });
        updateScreenWidth();
        onScreenResize();
      }
    });
    return {
      products,
      currentUsername,
      loadingUser,
      myDrafts,
      myPublished,
      myStats,
      loadingDrafts,
      loadingPublished,
      loadingStats,
      deleteProduct,
      getProductIcon,
      screenWidth,
      numCards,
      updateScreenWidth,
      onScreenResize,
    };
  },
};
</script>
<style></style>
