<template>
  <div class="w-full flex grow bg-slate-100">
    <div class="hidden w-[300px] md:flex flex-col">
      <div class="font-semibold p-6 text-lg">Collections</div>
      <ul class="space-y-3 text-slate-600">
        <template v-if="!loadingCollections && collections.length > 0">
          <template v-for="item in collections" :key="item">
            <li
              :class="[
                'flex items-center cursor-pointer hover:text-slate-900 px-6',
                activeCollection.id == item.id
                  ? 'text-slate-900 font-semibold'
                  : '',
              ]"
              @click="getProductsInCollection(item)"
            >
              <div class="w-[60px] h-[60px]">
                <img
                  src="@/shared/assets/mocks/16x9_001_astronaut.jpg"
                  alt=""
                  class="rounded-full w-[60px] h-[60px]"
                />
              </div>
              <span class="ml-4 line-clamp-1">{{ item.name }}</span>
            </li>
          </template>
        </template>
        <li
          class="flex items-center cursor-pointer text-sm pt-4 px-6"
          @click="openCreateDialog"
        >
          <PlusIcon class="h-5 w-5" />
          <span class="ml-4">New Collection</span>
        </li>
      </ul>
    </div>
    <div
      class="w-full md:w-[calc(100%-300px)] bg-slate-50 border-l border-slate-200 p-8 flex md:block justify-center"
    >
      <div class="max-w-[475px] sm:max-w-[1450px]">
        <template v-if="loadingCollections">
          <div
            class="h-8 bg-slate-200 rounded mb-8 w-1/3 lg:1/4 animate-pulse"
          ></div>
          <div
            class="h-6 bg-slate-200 rounded w-1/3 lg:1/4 animate-pulse"
          ></div>
        </template>
        <template v-else>
          <template v-if="collections.length == 0">
            <p class="italic">No collections to show</p>
          </template>
          <template v-else>
            <div class="text-2xl text-gray-700">
              {{ activeCollection.name }}
            </div>
            <div class="py-6 sm:flex justify-between items-center">
              <div v-if="productsInCollection.length == 0" class="italic">
                This collection is empty
              </div>
              <div v-else class="font-semibold mb-4 sm:mb-0">
                {{ numProducts }} products
              </div>
              <div class="flex space-x-4">
                <!-- <Listbox
              v-model="selectedSort"
              as="div"
              class="min-w-[215px] inline-flex items-center text-gray-700"
            >
              <div>
                <ListboxLabel
                  class="text-sm line-clamp-1 xl:line-clamp-none w-max"
                >
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
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
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
            </Listbox> -->
              </div>
            </div>
            <!-- <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          <template v-for="n in collectionProducts" :key="n">
            <MockProductCard :product="n" type="product" />
          </template>
        </div> -->
          </template>
        </template>
      </div>
    </div>
  </div>
  <BaseDialog
    :isOpen="isCreateDialogOpen"
    :title="'Create Collection'"
    class="max-w-fit"
    @close="closeCreateDialog"
  >
    <form id="createCollectionForm" @submit.prevent="createCollection">
      <!-- <p class="py-4 pr-4">Are you sure you want to do this?</p> -->
      <BaseInput
        v-model="collection.name"
        label="Name"
        autocomplete="off"
        type="text"
        required
      />
    </form>
    <template #actions>
      <BaseButton
        class="w-[100px]"
        color="secondary"
        @click.prevent="closeCreateDialog"
        >Cancel</BaseButton
      >
      <BaseButton
        class="w-[100px]"
        color="secondary"
        type="submit"
        form="createCollectionForm"
        >Create
        <!-- <div :class="loadingDelete ? 'flex space-x-4' : ''">
          <span>Delete</span>
          <span v-if="loadingDelete">
            <LoadingSpinner class="h-5 w-5" />
          </span>
        </div> -->
      </BaseButton>
    </template>
  </BaseDialog>
</template>
<script>
import { computed, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "@/shared/config/wireAxios";
// import {
//   Listbox,
//   ListboxLabel,
//   ListboxButton,
//   ListboxOptions,
//   ListboxOption,
// } from "@headlessui/vue";
import {
  //   CheckIcon,
  //   ChevronDownIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import BaseDialog from "../components/BaseDialog.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
export default {
  components: {
    // Listbox,
    // ListboxLabel,
    // ListboxButton,
    // ListboxOptions,
    // ListboxOption,
    // CheckIcon,
    // ChevronDownIcon,
    PlusIcon,
    BaseDialog,
    BaseButton,
    BaseInput,
  },
  setup() {
    const createSimpleNotification = inject("create-simple-notification");
    const createNotification = inject("create-notification");
    const collections = ref([]);
    const loadingCollections = ref(true);
    const loadingProducts = ref(true);
    const productsInCollection = ref([]);
    // const numProducts = computed(() => mySaved.value.length);
    const collection = ref({
      name: "",
      description: "",
      image: "",
    });
    const activeCollection = ref();
    const isCreateDialogOpen = ref(false);
    const closeCreateDialog = () => {
      isCreateDialogOpen.value = false;
    };
    const openCreateDialog = () => {
      isCreateDialogOpen.value = true;
    };

    const getCollections = () => {
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          console.log("Collections: ");
        }, 1000);
      } else {
        axios.get("/workspace/collections").then((response) => {
          loadingCollections.value = false;
          if (response.data) {
            collections.value = response.data.content;
            activeCollection.value = collections.value[0];
          } else {
            createNotification({
              title: "Error",
              message: "There was an error retrieving Collections.",
              type: "error",
              autoClose: false,
            });
          }
        });
      }
    };

    const getProductsInCollection = (collection) => {
      activeCollection.value = collection;
      loadingProducts.value = true;
      if (import.meta.env.MODE === "offline") {
        setTimeout(() => {
          console.log("Collections: ");
        }, 1000);
      } else {
        axios
          .get(`/workspace/collections/${collection.id}/products`)
          .then((response) => {
            loadingProducts.value = false;
            if (response.data) {
              productsInCollection.value = response.data.content;
            } else {
              createNotification({
                title: "Error",
                message: "There was an error retrieving the Collection.",
                type: "error",
                autoClose: false,
              });
            }
          });
      }
    };

    const createCollection = () => {
      console.log("Collection Form: ", collection.value);
      if (import.meta.env.MODE === "offline") {
        createSimpleNotification({
          message: `Collection Created`,
        });
      } else {
        axios
          .post("/workspace/collections", collection.value)
          .then((response) => {
            if (response.data.error) {
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              createSimpleNotification({
                message: `Created collection ${collection.value.name}`,
              });
              closeCreateDialog();
              // getCollections();
            }
          });
      }
    };

    onMounted(() => {
      getCollections();
    });

    return {
      collections,
      loadingCollections,
      loadingProducts,
      productsInCollection,
      getProductsInCollection,
      collection,
      activeCollection,
      createCollection,
      isCreateDialogOpen,
      openCreateDialog,
      closeCreateDialog,
    };
  },
};
</script>
<style></style>
