<template>
  <div>
    <div class="text-2xl text-gray-700">My Products</div>
    <div class="py-6 sm:flex justify-between items-center">
      <template v-if="loadingPublished">
        <div
          class="h-6 bg-slate-200 rounded mb-2 w-1/3 lg:1/4 animate-pulse"
        ></div>
      </template>
      <template v-else>
        <div v-if="numProducts > 0" class="font-semibold mb-4 sm:mb-0">
          {{ numProducts }} products
        </div>
      </template>
      <!-- <div class="flex space-x-4">
        <Listbox
          v-model="selectedSort"
          as="div"
          class="min-w-[215px] inline-flex items-center text-gray-700"
        >
          <div>
            <ListboxLabel class="text-sm line-clamp-1 xl:line-clamp-none w-max">
              Sort By
            </ListboxLabel>
          </div>
          <div class="w-full relative items-center ml-3">
            <ListboxButton
              class="relative w-full min-h-[2.125rem] rounded cursor-default pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
            >
              <span class="text-sm block truncate capitalize">{{
                selectedSort.name
              }}</span>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
              </span>
            </ListboxButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <ListboxOptions
                class="absolute w-full py-1 mt-1 overflow-auto text-gray-900 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
              >
                <ListboxOption
                  v-for="item in sortOptions"
                  v-slot="{ active, selected }"
                  :key="item.name"
                  :value="item"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-gray-100  ' : 'bg-none',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate text-sm',
                      ]"
                      >{{ item.name }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <button
          class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
        >
          <span>Filters</span>
          <AdjustmentsHorizontalIcon class="h-5 w-5" />
        </button>
      </div> -->
    </div>
    <template v-if="loadingPublished">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      ></div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <template v-for="card in 6" :key="card">
          <MyPublishedProductCard :loading="true" />
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="myPublished.length == 0">
        <p class="italic">No published products to show</p>
      </template>
      <template v-else>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <template v-for="product in myPublished" :key="product">
            <MyPublishedProductCard
              :product="product"
              type="product"
              @delete="openDeleteDialog(product)"
            />
          </template>
        </div>
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
        <BaseButton color="secondary" @click.prevent="closeDeleteDialog"
          >Cancel</BaseButton
        >
        <BaseButton color="danger" @click.prevent="deleteProduct">
          Delete
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
</template>
<script>
import { computed, onMounted, inject, ref } from "vue";
import axios from "@/config/wireAxios";
import BaseDialog from "../components/BaseDialog.vue";
import BaseButton from "../components/BaseButton.vue";
import MyPublishedProductCard from "../components/MyPublishedProductCard.vue";
import { productDetails } from "@/data";
// import {
//   AdjustmentsHorizontalIcon,
//   ChevronDownIcon,
//   CheckIcon,
// } from "@heroicons/vue/24/solid";
// import {
//   Listbox,
//   ListboxLabel,
//   ListboxButton,
//   ListboxOptions,
//   ListboxOption,
// } from "@headlessui/vue";
export default {
  components: {
    MyPublishedProductCard,
    BaseDialog,
    BaseButton,
    // AdjustmentsHorizontalIcon,
    // ChevronDownIcon,
    // CheckIcon,
    // Listbox,
    // ListboxLabel,
    // ListboxButton,
    // ListboxOptions,
    // ListboxOption,
  },
  setup() {
    const environment = ref(import.meta.env.MODE);
    const myPublished = ref([]);
    const loadingPublished = ref(true);
    const numProducts = computed(() => myPublished.value.length);
    const sortOptions = [
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];
    const selectedSort = ref(sortOptions[0]);
    const createNotification = inject("create-notification");
    const selectedProduct = ref();
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
        let p = myPublished.value.find(
          (item) => item.productNumber == selectedProduct.value.productNumber
        );
        let indexOfProduct = myPublished.value.indexOf(p);
        myPublished.value.splice(indexOfProduct, 1);
      } else {
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
            } else {
              createNotification({
                title: "Product Deleted",
                message: `Product ${selectedProduct.value.productNumber} has been deleted.`,
                type: "success",
              });
              closeDeleteDialog();
              let p = myPublished.value.find(
                (item) =>
                  item.productNumber == selectedProduct.value.productNumber
              );
              let indexOfProduct = myPublished.value.indexOf(p);
              myPublished.value.splice(indexOfProduct, 1);
            }
          });
      }
    };
    onMounted(() => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          let products = [];
          productDetails.forEach((product) => {
            if (product.data.state == "posted") {
              products.push(product.data);
            }
          });
          myPublished.value = products;
          loadingPublished.value = false;
        }, 1000);
      } else {
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
      }
    });
    return {
      environment,
      myPublished,
      loadingPublished,
      numProducts,
      sortOptions,
      selectedSort,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
      deleteProduct,
    };
  },
};
</script>
<style></style>
