<template>
  <div class="max-w-[475px] sm:max-w-[1600px] w-full p-8">
    <!-- User Content -->
    <template v-if="loadingUserContent">
      <div class="h-6 bg-slate-200 rounded my-6 w-1/3 animate-pulse"></div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="(card, index) in 4" :key="card">
          <PublishedProductCard
            :loading="true"
            :class="index < numCards ? 'block' : 'hidden'"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <!--- Recently Saved -->
      <template v-if="savedProducts.length > 0">
        <div class="text-2xl font-bold">For You</div>
        <div class="py-6 flex items-center justify-between">
          <div class="text-lg font-semibold text-gray-700">Recently Saved</div>
          <router-link
            v-if="
              savedProducts.length > 4 ||
              (savedProducts.length > 1 && numCards < savedProducts.length)
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
          <template v-for="(product, index) in savedProducts" :key="product">
            <PublishedProductCard
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
    </template>
    <!-- Organization Content -->
    <template v-if="loadingOrgContent">
      <div class="h-8 bg-slate-200 rounded my-6 w-1/2 animate-pulse"></div>
      <div class="h-6 bg-slate-200 rounded my-6 w-1/3 animate-pulse"></div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="(card, index) in 4" :key="card">
          <PublishedProductCard
            :loading="true"
            :class="index < numCards ? 'block' : 'hidden'"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="!user.organization">
        <div class="italic py-8">
          You are currently not affiliated with an organization.
        </div>
      </template>
      <template v-else>
        <div class="text-2xl font-bold py-8">
          Happening at {{ user.organization }}
        </div>
        <!--- Drafts within the last week --->
        <template v-if="canManageWire && draftProducts.length > 0">
          <div class="pb-6 flex items-center">
            <div class="text-lg font-semibold text-gray-700">
              Drafts within the last week
            </div>
          </div>
          <template v-if="draftProducts.length > 0">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
              <template
                v-for="(product, index) in draftProducts"
                :key="product"
              >
                <DraftProductCard
                  :product="product"
                  :productIcon="getProductIcon(product)"
                  type="product"
                  :class="index < numDraftCards ? 'block' : 'hidden'"
                  @delete="openDeleteDialog(product)"
                />
              </template>
            </div>
          </template>
          <template v-else>
            <p class="italic">
              No drafts have been created within the last week.
            </p>
          </template>
        </template>
        <!--- Recently published --->
        <div class="pb-6 flex justify-between items-center">
          <div class="text-lg font-semibold text-gray-700">
            Recently Published
          </div>
          <a
            v-if="
              publishedProducts.length > 4 ||
              (publishedProducts.length > 1 &&
                numCards < publishedProducts.length)
            "
            class="flex items-center text-gray-500 text-sm font-semibold"
            href="/search?text=&per_page=10&page=1&producing_offices[]=DNI"
            target="_blank"
          >
            <span>See All</span>
            <ChevronRightIcon class="h-4 w-4" />
          </a>
        </div>
        <template v-if="publishedProducts.length > 0">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <template
              v-for="(product, index) in publishedProducts"
              :key="product"
            >
              <PublishedProductCard
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
        <template v-else>
          <p class="italic">
            No products have been published by your organization.
          </p>
        </template>
        <!--- The Stats --->
        <template v-if="canManageWire">
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
                {{ stats.totalCreated }}
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
                {{ stats.totalViews }}
              </div>
            </div>
          </div>
        </template>
      </template>
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
import { computed, inject, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import axios from "@/shared/config/wireAxios";
import BaseDialog from "../components/BaseDialog.vue";
import BaseButton from "../components/BaseButton.vue";
import DraftProductCard from "../components/DraftProductCard.vue";
import PublishedProductCard from "../components/PublishedProductCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import Overlay from "../components/Overlay.vue";
import {
  ChevronRightIcon,
  EyeIcon,
  Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";
export default {
  components: {
    DraftProductCard,
    PublishedProductCard,
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
    const createNotification = inject("create-notification");
    const createSimpleNotification = inject("create-simple-notification");

    const user = computed(() => store.state.user.user);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);

    const loadingSaved = computed(() => store.state.workspace.saved.loading);
    const loadingDrafts = computed(() => store.state.workspace.drafts.loading);
    const loadingPublished = computed(
      () => store.state.workspace.published.loading
    );
    const loadingStats = computed(() => store.state.workspace.stats.loading);

    const savedProducts = computed(() => store.state.workspace.saved.items);
    const draftProducts = computed(() => store.state.workspace.drafts.items);
    const publishedProducts = computed(
      () => store.state.workspace.published.items
    );
    const stats = computed(() => store.state.workspace.stats.value);

    const loadingUserContent = ref(true);
    const loadingOrgContent = ref(true);

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
          let p = draftProducts.value.find(
            (item) => item.productNumber == selectedProduct.value.productNumber
          );
          let indexOfProduct = draftProducts.value.indexOf(p);
          draftProducts.value.splice(indexOfProduct, 1);
        } else {
          let p = publishedProducts.value.find(
            (item) => item.productNumber == selectedProduct.value.productNumber
          );
          let indexOfProduct = publishedProducts.value.indexOf(p);
          publishedProducts.value.splice(indexOfProduct, 1);
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
                let p = draftProducts.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfProduct = draftProducts.value.indexOf(p);
                draftProducts.value.splice(indexOfProduct, 1);
              } else {
                let p = publishedProducts.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfProduct = publishedProducts.value.indexOf(p);
                publishedProducts.value.splice(indexOfProduct, 1);
                let s = savedProducts.value.find(
                  (item) =>
                    item.productNumber == selectedProduct.value.productNumber
                );
                let indexOfSavedProduct = savedProducts.value.indexOf(s);
                savedProducts.value.splice(indexOfSavedProduct, 1);
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
          createSimpleNotification({
            message: `Product Saved`,
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
              createSimpleNotification({
                message: `Product Saved`,
              });
              store.dispatch("workspace/loadSavedProducts");
              store.dispatch("workspace/loadPublished");
            }
          });
        }
      }
    };

    const removingProduct = ref(false);
    const removeSavedProduct = (product) => {
      if (import.meta.env.MODE === "offline") {
        createSimpleNotification({
          message: `Saved Product Removed`,
        });
        let p = savedProducts.value.find(
          (item) => item.productNumber == product.productNumber
        );
        let indexOfProduct = savedProducts.value.indexOf(p);
        savedProducts.value.splice(indexOfProduct, 1);
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
            createSimpleNotification({
              message: `Saved Product Removed`,
            });
            let p = savedProducts.value.find(
              (item) => item.productNumber == product.productNumber
            );
            let indexOfProduct = savedProducts.value.indexOf(p);
            savedProducts.value.splice(indexOfProduct, 1);
            store.dispatch("workspace/loadPublished");
          }
        });
      }
    };
    const getProductIcon = (product) => {
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

    const loadOrgContent = () => {
      if (user.value.organization) {
        store.dispatch("workspace/loadPublished");
        if (canManageWire.value) {
          store.dispatch("workspace/loadDrafts");
          store.dispatch("workspace/loadStats");
        }
      }
    };

    watch([loadingSaved], () => {
      if (!loadingSaved.value) {
        loadingUserContent.value = false;
      } else {
        loadingUserContent.value = true;
      }
    });

    watch([loadingDrafts, loadingPublished, loadingStats], () => {
      if (
        !loadingDrafts.value &&
        !loadingPublished.value &&
        !loadingStats.value
      ) {
        loadingOrgContent.value = false;
      } else {
        if (!canManageWire.value) {
          if (!loadingPublished.value) {
            loadingOrgContent.value = false;
          } else {
            loadingOrgContent.value = true;
          }
        } else {
          loadingOrgContent.value = true;
        }
      }
    });

    onMounted(() => {
      store.dispatch("workspace/loadSavedProducts");
      loadOrgContent();
      updateScreenWidth();
      window.addEventListener("resize", () => {
        updateScreenWidth();
      });
    });

    return {
      user,
      canManageWire,
      savedProducts,
      draftProducts,
      publishedProducts,
      stats,
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
      numCards,
      numDraftCards,
      loadingUserContent,
      loadingOrgContent,
    };
  },
};
</script>
<style></style>
