<template>
  <div
    class="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="flex flex-col space-y-4">
      <h1 class="font-semibold text-2xl">Publish a Product</h1>
      <h2>Get started by selecting from the following options.</h2>
    </div>
    <BaseDatepicker
      v-model="selectedDate"
      class="w-fit h-fit"
      :enable-time-picker="false"
      :disabled-week-days="[6, 0]"
      week-start="0"
      auto-apply
      @update:modelValue="selectDate"
    >
      <template #trigger>
        <BaseCard class="p-2 cursor-pointer">
          <div class="flex items-center">
            <CalendarIcon
              class="hover:text-black dark:hover:text-white energy:hover:text-white h-6 w-6"
            />
            <span class="pl-2 text-lg">
              {{ routeDate }}
            </span>
          </div>
        </BaseCard>
      </template>
    </BaseDatepicker>
  </div>
  <div
    class="py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="mb-6">
      <h3 class="font-semibold text-lg">Create a Product</h3>
      <p>Select the product you'd like to create</p>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full mb-6"
    >
      <template v-for="product in availableProductTypes" :key="product">
        <div class="" @click="goToProduct(product.payload)">
          <BaseCard
            class="flex justify-center items-center font-medium cursor-pointer"
            hoverable
          >
            <p class="z-5 p-10 text-2xl font-bold">
              {{ product.displayName }}
            </p>
            <BaseProductIcon
              class="absolute w-24 h-24 text-mission-blue/10 dark:text-slate-300/10 energy:text-zinc-300/10"
              :icon="product.icon"
            />
          </BaseCard>
        </div>
      </template>
    </div>
    <p v-if="!isCommunityExclusive">
      Not sure which product to choose?
      <a class="font-semibold cursor-pointer" @click="goToProduct()"
        >Click here</a
      >
      to start with a blank template.
    </p>
  </div>
  <template v-if="loadingProducts">
    <div class="max-w-fit m-auto mt-[20vh]">
      <BaseLoadingSpinner class="h-24 w-24" />
    </div>
  </template>
  <template v-else>
    <div class="py-6">
      <div class="flex justify-between">
        <h3 class="font-semibold mb-6 text-lg">
          Edit Existing Products ({{ filterProducts().length }})
        </h3>
        <div class="flex items-center">
          <input
            id="showDrafts"
            v-model="showOnlyDrafts"
            type="checkbox"
            name="showDrafts"
            value="Drafts"
            @change="filterProducts()"
          />
          <label for="showDrafts" class="ml-2 text-sm">Show Drafts Only</label>
        </div>
      </div>
      <template v-if="products?.length > 0">
        <BaseCard>
          <template
            v-for="{ attributes: product } in filterProducts()"
            :key="product"
          >
            <div
              class="flex justify-between p-4 border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-50/[0.06]"
            >
              <div class="flex px-2">
                <div class="pr-4">
                  <ProductImage
                    class="h-[125px] w-[125px]"
                    :article="product"
                    @click="
                      product.images.length > 0
                        ? openPreviewThumbnailDialog(product)
                        : null
                    "
                  />
                </div>
                <div>
                  <router-link
                    :to="{
                      name:
                        product.state === 'draft'
                          ? 'product-preview'
                          : 'product',
                      params: { doc_num: product.doc_num },
                    }"
                  >
                    <h4
                      class="line-clamp-6 md:line-clamp-4 lg:line-clamp-2 hover:underline break-words"
                    >
                      {{
                        product.title_classif && product.title_classif !== "X"
                          ? `(${product.title_classif})`
                          : ""
                      }}
                      {{ product.title }}
                    </h4>
                  </router-link>
                  <div class="text-sm break-all">
                    <p
                      class="uppercase py-2 text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80"
                    >
                      {{ dayjs(product.date_published).format("D MMM") }} -
                      <span class="font-medium pr-1">{{
                        product.product_type
                      }}</span>
                      |
                      <span class="pl-1">{{ product.doc_num }}</span>
                    </p>
                    <p class="line-clamp-5 md:line-clamp-3 break-all">
                      {{
                        product.summary_classif &&
                        product.summary_classif !== "X"
                          ? `(${product.summary_classif})`
                          : ""
                      }}
                      {{ product.summary }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex pl-2">
                <p
                  :class="[
                    'min-w-[100px] capitalize pr-4',
                    product.state === 'draft'
                      ? 'text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow'
                      : 'italic text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80',
                  ]"
                >
                  {{ product.state }}
                </p>
                <template
                  v-if="
                    canEditProduct(product.product_type) && !product?.legacy
                  "
                >
                  <router-link
                    :to="{
                      name: 'edit',
                      params: {
                        date: routeDate,
                        id: product.id,
                        doc_num: product.doc_num,
                      },
                    }"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </router-link>
                </template>
              </div>
            </div>
          </template>
          <BaseDialog
            :isOpen="isPreviewThumbnailDialogOpen"
            :title="'Thumbnail Preview'"
            class="max-w-fit"
            @close="closePreviewThumbnailDialog"
          >
            <div
              id="img-container"
              class="m-6 relative overflow-hidden w-[443px] h-[176px] border-8 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              <div
                id="product-blur"
                class="h-full w-full absolute blur-lg opacity-60 bg-center bg-no-repeat bg-cover"
              ></div>
              <ProductImage
                :article="selectedProduct"
                class="inset-x-0 absolute h-full mx-auto z-[3]"
              />
            </div>
            <p class="italic">
              Only shown when the product is featured on the front page.
            </p>
          </BaseDialog>
        </BaseCard>
      </template>
      <template v-else>
        <p class="pt-2 italic">No products found.</p>
      </template>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "@/config/wireAxios";
import { metadata } from "@/config";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { CalendarIcon, PencilIcon } from "@heroicons/vue/24/outline";
import ProductImage from "@/components/ProductImage";

export default {
  components: {
    CalendarIcon,
    PencilIcon,
    ProductImage,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const routeDate = computed(() => route.params.date);
    const selectedDate = ref();
    const loadingCriteria = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const products = computed(() => store.state.wires.articles);
    const loadingProducts = computed(() => store.state.wires.loading);
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const showOnlyDrafts = ref(false);
    const filterProducts = () => {
      if (showOnlyDrafts.value) {
        return products.value.filter((p) => p.attributes.state === "draft");
      } else {
        return products.value;
      }
    };

    const defaultPayload = {
      document_action: "create",
      //dissem_orgs: ["DNI"],
      html_body: "<p></p>",
      producing_office: "DNI/NCTC",
      publication_number: Math.floor(100000 * Math.random() * 900000),
      product_type_id: 10376,
      title: "Draft Document Title",
      topics: [
        {
          name: "Terrorism",
          code: "TERR",
        },
      ],
    };

    const buildAvailableProducts = () => {
      let availableProducts = [];
      criteria.value.product_types
        .filter((product) => product.publishable === true)
        .forEach((type) => {
          const match = metadata.product_types.find(
            ({ code }) => code === type.code
          );
          const product = { ...match };
          if (product.payload) {
            const formattedTitle = `${dayjs().format("DD MMMM YYYY")} ${
              product.payload.title
            }`;
            product.payload = {
              ...defaultPayload,
              ...product.payload,
              title: formattedTitle,
            };
          } else {
            product.payload = { ...defaultPayload };
          }
          product.payload.product_type_id = product.code;
          availableProducts.push({ icon: "wave", ...product });
        });
      if (isCommunityExclusive.value) {
        availableProducts = availableProducts.filter(
          (product) => product.displayName === "Community Product"
        );
      }
      return availableProducts;
    };

    const availableProductTypes = ref(buildAvailableProducts());

    watch([loadingCriteria], () => {
      if (!loadingCriteria.value) {
        availableProductTypes.value = buildAvailableProducts();
      }
    });

    const goToProduct = (payload) => {
      if (!payload) {
        payload = { ...defaultPayload };
      }
      payload["wire_id"] = dayjs(selectedDate.value).format("YYYY-MM-DD");
      if (process.env.NODE_ENV === "low") {
        router.push({
          name: "edit",
          params: {
            date: route.params.date,
            id: 25,
            doc_num: "WIRe001_sample_6",
          },
        });
      } else {
        axios.post("/articles", payload).then((response) => {
          router.push({
            name: "edit",
            params: {
              date: route.params.date,
              id: response.data.id,
              doc_num: response.data.doc_num,
              product_type_id: response.data.product_type_id,
            },
          });
        });
      }
    };

    const selectDate = () => {
      const date = dayjs(selectedDate.value).format("YYYY-MM-DD");
      router.push({ name: "publish", params: { date } });
    };

    const canEditProduct = (product) => {
      if (!isCommunityExclusive.value) {
        return true;
      } else {
        if (product === "Community Product") {
          return true;
        }
        return false;
      }
    };

    const selectedProduct = ref({});
    const isPreviewThumbnailDialogOpen = ref(false);
    const openPreviewThumbnailDialog = (product) => {
      selectedProduct.value = product;
      isPreviewThumbnailDialogOpen.value = true;
    };
    const closePreviewThumbnailDialog = () => {
      isPreviewThumbnailDialogOpen.value = false;
    };

    onMounted(() => {
      store.dispatch("wires/getWireByDate", route.params.date);
      selectedDate.value = dayjs(route.params.date).toDate();
    });

    watch(
      () => route.query,
      () => {
        if (route.name === "publish") {
          store.dispatch("wires/getWireByDate", route.params.date);
          selectedDate.value = dayjs(route.params.date).toDate();
        }
      }
    );

    return {
      dayjs,
      routeDate,
      selectedDate,
      products,
      loadingProducts,
      isCommunityExclusive,
      showOnlyDrafts,
      filterProducts,
      availableProductTypes,
      goToProduct,
      selectDate,
      canEditProduct,
      selectedProduct,
      isPreviewThumbnailDialogOpen,
      openPreviewThumbnailDialog,
      closePreviewThumbnailDialog,
    };
  },
};
</script>

<style scoped lang="scss"></style>
