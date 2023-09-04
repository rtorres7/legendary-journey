<template>
  <div class="max-w-[475px] sm:max-w-[1600px] w-full p-8">
    <template v-if="!loadingSaved && recentlySaved.length > 0">
      <div class="text-2xl font-bold">For You</div>
      <div class="py-6 flex items-center justify-between">
        <div class="text-lg font-semibold text-gray-700">Recently Saved</div>
        <router-link
          v-if="
            recentlySaved.length > 4 ||
            (recentlySaved.length > 1 && numCards < recentlySaved.length)
          "
          class="flex items-center text-gray-500 text-sm font-semibold"
          to="/workspace/saved"
        >
          <span>See All</span>
          <ChevronRightIcon class="h-4 w-4" />
        </router-link>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="(product, index) in recentlySaved" :key="product">
          <MyPublishedProductCard
            :product="product"
            type="product"
            :productTypeName="getProductTypeName(product)"
            :class="index < numCards ? 'block' : 'hidden'"
            @delete="openDeleteDialog(product)"
            @save="saveProduct(product)"
          />
        </template>
      </div>
    </template>
    <div
      v-if="loadingUser"
      class="h-8 bg-slate-200 rounded my-6 w-1/2 animate-pulse"
    ></div>
    <div v-if="!loadingUser && currentUserOrg" class="text-2xl font-bold py-6">
      Happening at {{ currentUserOrg }}
    </div>
    <template v-if="!loadingDrafts && !loadingPublished">
      <template v-if="myDrafts.length > 0 && canManageWire">
        <div class="pb-6 flex items-center">
          <div class="text-lg font-semibold text-gray-700">
            Drafts within the last week
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
          <template v-for="(product, index) in myDrafts" :key="product">
            <MyDraftProductCard
              :product="product"
              :productIcon="getProductIcon(product)"
              type="product"
              :class="index < numDraftCards ? 'block' : 'hidden'"
              @delete="openDeleteDialog(product)"
            />
          </template>
        </div>
      </template>
      <div class="pb-6 flex justify-between items-center">
        <div class="text-lg font-semibold text-gray-700">
          Recently Published
        </div>
        <a
          v-if="
            myPublished.length > 4 ||
            (myPublished.length > 1 && numCards < myPublished.length)
          "
          class="flex items-center text-gray-500 text-sm font-semibold"
          href="/search?text=&per_page=10&page=1&producing_offices[]=DNI"
          target="_blank"
        >
          <span>See All</span>
          <ChevronRightIcon class="h-4 w-4" />
        </a>
      </div>
    </template>
    <template v-if="myPublished.length == 0 && !loadingPublished">
      <p class="italic">No published products to show</p>
    </template>
    <template v-if="loadingPublished">
      <div class="h-6 bg-slate-200 rounded my-6 w-1/3 animate-pulse"></div>
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
            :productTypeName="getProductTypeName(product)"
            :class="index < numCards ? 'block' : 'hidden'"
            @delete="openDeleteDialog(product)"
            @save="saveProduct(product)"
          />
        </template>
      </div>
    </template>
    <template v-if="canManageWire && !loadingStats">
      <div class="py-6 flex items-center">
        <div class="text-lg font-semibold text-gray-700">The Stats</div>
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
          <div class="font-semibold text-xl text-slate-700">
            {{ myStats.totalCreated }}
          </div>
        </div>
        <div
          class="flex justify-between border border-slate-300/70 shadow-sm rounded px-6 py-4 max-w-[464px]"
        >
          <div class="flex space-x-4 items-center text-slate-500">
            <EyeIcon class="h-5 w-5" />
            <span class="text-sm font-normal">Total Views</span>
          </div>
          <div class="font-semibold text-xl text-slate-700">
            {{ myStats.totalViews }}
          </div>
        </div>
      </div>
    </template>
    <BaseDialog
      :isOpen="isDeleteDialogOpen"
      :title="'Delete Product'"
      class="max-w-fit"
      @close="closeDeleteDialog"
    >
      <p class="py-4 pr-4">Are you sure you want to do this?</p>
      <template #actions>
        <BaseButton
          class="w-[100px]"
          color="secondary"
          @click.prevent="closeDeleteDialog"
          >Cancel</BaseButton
        >
        <BaseButton
          class="w-[100px]"
          color="danger"
          @click.prevent="deleteProduct"
        >
          <div :class="loadingDelete ? 'flex space-x-4' : ''">
            <span>Delete</span>
            <span v-if="loadingDelete">
              <LoadingSpinner class="h-5 w-5" />
            </span>
          </div>
        </BaseButton>
      </template>
    </BaseDialog>
    <Overlay :show="removingProduct">
      <div class="max-w-xs inline-block">
        <p class="mb-4 font-semibold text-2xl">Removing Product...</p>
        <div class="w-fit m-auto">
          <LoadingSpinner class="h-16 w-16" />
        </div>
      </div>
    </Overlay>
    <Overlay :show="savingProduct">
      <div class="max-w-xs inline-block">
        <p class="mb-4 font-semibold text-2xl">Saving Product...</p>
        <div class="w-fit m-auto">
          <LoadingSpinner class="h-16 w-16" />
        </div>
      </div>
    </Overlay>
  </div>
</template>
<script>
import { computed, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "@/shared/config/wireAxios";
import BaseDialog from "../components/BaseDialog.vue";
import BaseButton from "../components/BaseButton.vue";
import MyDraftProductCard from "../components/MyDraftProductCard.vue";
import MyPublishedProductCard from "../components/MyPublishedProductCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import Overlay from "../components/Overlay.vue";
import { products } from "@/shared/data";
import {
  ChevronRightIcon,
  EyeIcon,
  Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";
export default {
  components: {
    MyDraftProductCard,
    MyPublishedProductCard,
    LoadingSpinner,
    Overlay,
    ChevronRightIcon,
    EyeIcon,
    Square3Stack3DIcon,
    BaseDialog,
    BaseButton,
  },
  setup() {
    const store = useStore();
    const environment = ref(import.meta.env.MODE);
    const metadata = inject("metadata");
    const currentUsername = computed(() => store.state.user.user.name);
    const currentUserOrg = computed(() => store.state.user.user.organization);
    const loadingUser = computed(() => store.state.user.loading);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const myDrafts = ref([]);
    const myPublished = ref([]);
    const recentlySaved = ref([]);
    const myStats = ref({
      totalViews: 0,
      totalCreated: 0,
    });
    const loadingDrafts = ref(true);
    const loadingPublished = ref(true);
    const loadingSaved = ref(true);
    const loadingStats = ref(true);
    const createNotification = inject("create-notification");
    const selectedProduct = ref();
    const loadingDelete = ref(false);
    const isDeleteDialogOpen = ref(false);
    const closeDeleteDialog = () => {
      isDeleteDialogOpen.value = false;
    };
    const openDeleteDialog = (product) => {
      selectedProduct.value = product;
      isDeleteDialogOpen.value = true;
    };
    const deleteProduct = () => {
      if (import.meta.env.MODE === "offline") {
        createNotification({
          title: "Product Deleted",
          message: `Product ${selectedProduct.value.productNumber} has been deleted.`,
          type: "success",
        });
        closeDeleteDialog();
        if (selectedProduct.value.state == "draft") {
          let p = myDrafts.value.find(
            (item) => item.productNumber == selectedProduct.value.productNumber
          );
          let indexOfProduct = myDrafts.value.indexOf(p);
          myDrafts.value.splice(indexOfProduct, 1);
        } else {
          let p = myPublished.value.find(
            (item) => item.productNumber == selectedProduct.value.productNumber
          );
          let indexOfProduct = myPublished.value.indexOf(p);
          myPublished.value.splice(indexOfProduct, 1);
        }
      } else {
        loadingDelete.value = true;
        axios
          .delete("/documents/" + selectedProduct.value.featureId + "/deleteMe")
          .then((response) => {
            if (response.data.error) {
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
              loadingDelete.value = false;
            } else {
              createNotification({
                title: "Product Deleted",
                message: `Product ${selectedProduct.value.productNumber} has been deleted.`,
                type: "success",
              });
              loadingDelete.value = false;
              closeDeleteDialog();
              if (selectedProduct.value.state == "draft") {
                let p = myDrafts.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfProduct = myDrafts.value.indexOf(p);
                myDrafts.value.splice(indexOfProduct, 1);
              } else {
                let p = myPublished.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfProduct = myPublished.value.indexOf(p);
                myPublished.value.splice(indexOfProduct, 1);
                let s = recentlySaved.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfSavedProduct = recentlySaved.value.indexOf(s);
                recentlySaved.value.splice(indexOfSavedProduct, 1);
              }
            }
          });
      }
    };
    const savingProduct = ref(false);
    const saveProduct = (product) => {
      if (product.saved) {
        removeSavedProduct(product);
      } else {
        if (import.meta.env.MODE === "offline") {
          createNotification({
            title: "Product Saved",
            message: `Product ${product.productNumber} has been saved.`,
            type: "success",
          });
        } else {
          savingProduct.value = true;
          axios.put("/workspace/saved/" + product.id).then((response) => {
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
              loadSavedProducts();
              loadPublishedProducts();
            }
          });
        }
      }
    };

    const removingProduct = ref(false);
    const removeSavedProduct = (product) => {
      if (import.meta.env.MODE === "offline") {
        createNotification({
          title: "Saved Product Removed",
          message: `Product ${product.productNumber} has been removed from Saved Products.`,
          type: "success",
        });
        let p = recentlySaved.value.find(
          (item) => item.productNumber == product.productNumber
        );
        let indexOfProduct = recentlySaved.value.indexOf(p);
        recentlySaved.value.splice(indexOfProduct, 1);
      } else {
        removingProduct.value = true;
        axios.delete("/workspace/saved/" + product.id).then((response) => {
          if (response.data.error) {
            removingProduct.value = false;
            createNotification({
              title: "Error",
              message: response.data.error,
              type: "error",
              autoClose: false,
            });
          } else {
            removingProduct.value = false;
            createNotification({
              title: "Product Removed",
              message: `Product ${product.productNumber} has been removed from Saved Products.`,
              type: "success",
            });
            let p = recentlySaved.value.find(
              (item) => item.productNumber == product.productNumber
            );
            let indexOfProduct = recentlySaved.value.indexOf(p);
            recentlySaved.value.splice(indexOfProduct, 1);
            loadPublishedProducts();
          }
        });
      }
    };
    const getProductIcon = (product) => {
      console.log("product: ", product);
      console.log("metadata: ", metadata);
      console.log("environment: ", environment);
      let p;
      if (
        environment.value != "production" &&
        environment.value != "development"
      ) {
        p = metadata.product_types.find(
          (p) => p.code == product.productType.code
        );
      } else {
        p = metadata.product_types.find(
          (p) => p.code == product.productType.id
        );
      }
      console.log("p: ", p);
      if (p && p.icon) {
        return p.icon;
      } else {
        return;
      }
    };
    const getProductTypeName = (product) => {
      if (product.productType.name) {
        return product.productType.name;
      } else {
        let type = metadata.product_types.find(
          (item) => item.code === product.productType
        );
        return type?.displayName;
      }
    };
    const numCards = ref();
    const numDraftCards = ref();
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
        numDraftCards.value = 1;
      } else if (screenWidth.value >= 640 && screenWidth.value < 1024) {
        numCards.value = 2;
        numDraftCards.value = 2;
      } else if (screenWidth.value >= 1024 && screenWidth.value < 1536) {
        numCards.value = 3;
        numDraftCards.value = 3;
      } else {
        numCards.value = 4;
        numDraftCards.value = 3;
      }
    };

    const loadSavedProducts = () => {
      axios.get("/workspace/saved").then((response) => {
        loadingSaved.value = false;
        if (response.data) {
          recentlySaved.value = response.data.content;
        } else {
          createNotification({
            title: "Error",
            message: "There was an error retrieving Recently Saved Products.",
            type: "error",
            autoClose: false,
          });
        }
      });
    };

    const loadPublishedProducts = () => {
      axios.get("/workspace/recent").then((response) => {
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
    };

    onMounted(() => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          let drafts = products.draft.map((product) => {
            return {
              ...product.attributes,
            };
          });
          let published = products.published.map((product) => {
            return {
              ...product.attributes,
            };
          });
          myDrafts.value = drafts;
          myPublished.value = published;
          loadingDrafts.value = false;
          loadingPublished.value = false;
        }, 1000);
      } else {
        loadSavedProducts();
        loadPublishedProducts();
        axios.get("/workspace/drafts").then((response) => {
          loadingDrafts.value = false;
          if (response.data) {
            myDrafts.value = response.data.content;
          } else {
            console.error("Couldn't retrieve drafts");
          }
        });
        axios.get("/workspace/stats").then((response) => {
          loadingStats.value = false;
          if (response.data && response.data.totalViews) {
            myStats.value.totalViews = computed(() => response.data.totalViews);
            myStats.value.totalCreated = computed(
              () => response.data.totalCreated
            );
          } else {
            console.error("Couldn't retrieve stats");
          }
        });
      }
      updateScreenWidth();
      onScreenResize();
    });
    return {
      environment,
      currentUsername,
      currentUserOrg,
      loadingUser,
      canManageWire,
      myDrafts,
      myPublished,
      recentlySaved,
      myStats,
      loadingDrafts,
      loadingPublished,
      loadingSaved,
      loadingStats,
      loadingDelete,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
      deleteProduct,
      savingProduct,
      saveProduct,
      removingProduct,
      removeSavedProduct,
      getProductIcon,
      getProductTypeName,
      screenWidth,
      numCards,
      numDraftCards,
      updateScreenWidth,
      onScreenResize,
    };
  },
};
</script>
<style></style>
