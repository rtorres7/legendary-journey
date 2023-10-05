<template>
  <div class="w-full flex flex-col md:flex-row grow bg-slate-100">
    <div class="w-full md:w-[300px] md:flex flex-col">
      <div class="flex justify-between items-center">
        <div class="font-semibold p-6 text-lg">Collections</div>
        <div
          class="md:hidden flex items-center cursor-pointer text-sm px-6 hover:text-slate-900"
          @click="openCreateDialog"
        >
          <PlusIcon class="h-5 w-5" />
          <span class="ml-4">New Collection</span>
        </div>
      </div>
      <ul class="hidden md:flex md:flex-col space-y-3 text-slate-600 mb-6">
        <template v-if="!loadingCollections && collections.length > 0">
          <template v-for="item in collections" :key="item">
            <li
              :class="[
                'flex flex-row items-center cursor-pointer hover:text-slate-900 px-6 w-full',
                activeCollection.id == item.id
                  ? 'text-slate-900 font-semibold'
                  : '',
              ]"
              @click="getProductsInCollection(item)"
            >
              <div class="w-[60px] h-[60px] shrink-0">
                <img
                  v-if="item.image == null || item.image == ''"
                  src="@/shared/assets/image-not-available-1x1.png"
                  alt=""
                  class="rounded-full w-[60px] h-[60px]"
                />
                <img
                  v-else
                  :id="item.id"
                  :src="getCollectionThumbnail(item.id)"
                  alt=""
                  class="rounded-full w-[60px] h-[60px]"
                />
              </div>
              <span class="ml-4 truncate w-full text-left">{{
                item.name
              }}</span>
            </li>
          </template>
        </template>
        <li
          class="flex items-center cursor-pointer text-sm pt-4 px-6 hover:text-slate-900"
          @click="openCreateDialog"
        >
          <PlusIcon class="h-5 w-5" />
          <span class="ml-4">New Collection</span>
        </li>
      </ul>
      <Carousel
        :settings="carouselSettings"
        :breakpoints="carouselBreakpoints"
        class="md:hidden w-full"
      >
        <template v-if="!loadingCollections">
          <Slide v-for="item in collections" :key="item">
            <div class="w-full h-36 text-left mx-4">
              <div
                :class="[
                  'flex flex-col items-center cursor-pointer hover:text-slate-900 px-2 w-[100px]',
                  activeCollection.id == item.id
                    ? 'text-slate-900 font-semibold'
                    : '',
                ]"
                @click="getProductsInCollection(item)"
              >
                <div class="w-[60px] h-[60px] shrink-0">
                  <img
                    v-if="item.image == null || item.image == ''"
                    src="@/shared/assets/image-not-available-1x1.png"
                    alt=""
                    class="rounded-full w-[60px] h-[60px]"
                  />
                  <img
                    v-else
                    :id="'mobile' + item.id"
                    :src="getCollectionThumbnail(item.id, 'mobile')"
                    alt=""
                    class="rounded-full w-[60px] h-[60px]"
                  />
                </div>
                <span class="truncate text-sm w-[90px] text-center">{{
                  item.name
                }}</span>
              </div>
            </div>
          </Slide>
        </template>
        <template #addons>
          <Navigation
            v-if="!loadingCollections && collections.length > 0"
            class="bg-slate-900 text-slate-300 hover:text-gray-200"
          />
        </template>
      </Carousel>
    </div>
    <div
      class="w-full md:w-[calc(100%-300px)] md:bg-slate-50 border-l border-slate-200 p-8 flex md:block justify-center"
    >
      <template v-if="loadingCollections || loadingProducts">
        <div class="w-full">
          <div
            class="h-8 bg-slate-200 rounded mb-8 md:w-1/2 animate-pulse"
          ></div>
          <div
            class="h-6 bg-slate-200 rounded mb-8 w-1/2 md:w-1/3 animate-pulse"
          ></div>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 min-w-[250px] sm:min-w-[400px] max-w-[475px] sm:max-w-[1450px]"
          >
            <template v-for="card in 6" :key="card">
              <PublishedProductCard :loading="true" />
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="w-full">
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
                {{ productsInCollection.length }} products
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
        </div>
      </template>
    </div>
  </div>
  <BaseDialog
    :isOpen="isCreateDialogOpen"
    :title="'Create Collection'"
    class="max-w-fit"
    @close="closeCreateDialog"
  >
    <form id="createCollectionForm" @submit.prevent="createCollection">
      <div class="flex flex-col space-y-6">
        <div>
          <BaseInput
            v-model="collection.name"
            label="Name"
            autocomplete="off"
            type="text"
            required
          />
        </div>
        <div>
          <ImageFileChooser
            :label="'Thumbnail'"
            :binary="imageBinary"
            :file="imageFile"
            @onImageAdded="updateImageFile"
            @onImageRemoved="removeImageFile"
          />
        </div>
      </div>
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
        :disabled="isSubmitDisabled()"
        >Create
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
import PublishedProductCard from "../components/PublishedProductCard.vue";
import ImageFileChooser from "../components/ImageFileChooser.vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
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
    PublishedProductCard,
    ImageFileChooser,
    Carousel,
    Navigation,
    Slide,
  },
  setup() {
    const carouselSettings = {
      itemsToShow: 3,
      snapAlign: "start",
    };
    const carouselBreakpoints = {
      468: {
        itemsToShow: 4,
        snapAlign: "start",
      },
      568: {
        itemsToShow: 5,
        snapAlign: "start",
      },
    };
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
    });
    const activeCollection = ref();
    const imageFile = ref(null);
    const imageBinary = ref("");

    const updateImageFile = (payload) => {
      imageFile.value = payload.file;
      imageBinary.value = payload.binary;
    };

    const removeImageFile = () => {
      imageFile.value = null;
      imageBinary.value = "";
    };

    const isSubmitDisabled = () => {
      if (collection.value.name == "") {
        return true;
      } else {
        return false;
      }
    };

    const isCreateDialogOpen = ref(false);
    const closeCreateDialog = () => {
      isCreateDialogOpen.value = false;
      resetForm();
    };
    const openCreateDialog = () => {
      isCreateDialogOpen.value = true;
    };

    const resetForm = () => {
      collection.value = {
        name: "",
        description: "",
      };
      imageFile.value = null;
      imageBinary.value = "";
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
            getProductsInCollection(activeCollection.value);
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

    const getCollectionThumbnail = (id, mobile) => {
      if (import.meta.env.MODE === "offline") {
        return "@/shared/assets/mocks/1x1_001_plane.jpg";
      } else {
        axios
          .get(`/workspace/collection/image/${id}`, { responseType: "blob" })
          .then((response) => {
            var blobURL = URL.createObjectURL(response.data);
            var image;
            if (mobile) {
              image = document.getElementById(`mobile${id}`);
            } else {
              image = document.getElementById(id);
            }
            image.onload = function () {
              //release the blob URL once the image is loaded
              URL.revokeObjectURL(this.src);
            };
            image.src = blobURL;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    const getProductsInCollection = (collection) => {
      if (!loadingCollections.value && collections.value.length > 0) {
        activeCollection.value = collection;
        loadingProducts.value = true;
        if (import.meta.env.MODE === "offline") {
          setTimeout(() => {
            loadingProducts.value = false;
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
      } else {
        loadingProducts.value = false;
      }
    };

    const createCollection = () => {
      if (import.meta.env.MODE === "offline") {
        createSimpleNotification({
          message: `Collection Created`,
        });
      } else {
        const data = new FormData();
        data.append("name", collection.value.name);
        data.append("thumbnail", imageFile.value);
        axios.post("/workspace/collections", data).then((response) => {
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
            console.log(response.data);
            closeCreateDialog();
            getCollections();
            resetForm();
          }
        });
      }
    };

    onMounted(() => {
      getCollections();
    });

    return {
      carouselSettings,
      carouselBreakpoints,
      collections,
      loadingCollections,
      loadingProducts,
      productsInCollection,
      getCollectionThumbnail,
      getProductsInCollection,
      collection,
      activeCollection,
      imageFile,
      imageBinary,
      updateImageFile,
      removeImageFile,
      isSubmitDisabled,
      createCollection,
      isCreateDialogOpen,
      openCreateDialog,
      closeCreateDialog,
    };
  },
};
</script>
<style></style>
