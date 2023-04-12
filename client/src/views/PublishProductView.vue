<template>
  <div
    class="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="flex flex-col space-y-4">
      <h1 class="font-semibold text-2xl">Publish a Product</h1>
      <h2>Get started by selecting from the following options.</h2>
    </div>
    <MaxDatepicker
      v-model="selectedDate"
      class="w-fit h-fit"
      :enable-time-picker="false"
      :disabled-week-days="[6, 0]"
      week-start="0"
      auto-apply
      @update:modelValue="selectDate"
    >
      <template #trigger>
        <tippy content="Select a date">
          <MaxCard class="p-2 cursor-pointer">
            <button class="flex items-center">
              <CalendarIcon
                class="hover:text-black dark:hover:text-white energy:hover:text-white h-6 w-6"
              />
              <span class="sr-only">select a date from the calendar</span>
              <span class="pl-2 text-lg">
                {{ routeDate }}
              </span>
            </button>
          </MaxCard>
        </tippy>
      </template>
    </MaxDatepicker>
  </div>
  <div
    class="py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="mb-6">
      <h3 class="font-semibold text-lg">Create a Product</h3>
      <p>Select the product you'd like to create</p>
    </div>
    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-6">
      <template v-for="product in availableProductTypes" :key="product">
        <MaxCard
          class="flex justify-center items-center font-medium cursor-pointer"
          hoverable
          tabindex="0"
          role="button"
          :aria-label="`Create a ${product.displayName}`"
          @click="goToArticle(product.payload)"
          @keyup.enter="goToArticle(product.payload)"
        >
          <span
            class="z-5 px-6 py-8 lg:px-9 lg:py-10 text-xl lg:text-2xl font-bold"
          >
            {{ product.displayName }}
          </span>
          <MaxProductIcon
            class="absolute w-16 h-16 lg:w-24 lg:h-24 text-mission-blue/10 dark:text-slate-300/10 energy:text-zinc-300/10"
            :icon="product.icon"
          />
        </MaxCard>
      </template>
    </div>
    <p v-if="!isCommunityExclusive">
      Not sure which product to choose?
      <span
        class="font-semibold cursor-pointer"
        tabindex="0"
        role="button"
        aria-label="Create a blank template"
        @click="goToArticle()"
        @keyup.enter="goToArticle()"
        >Click here</span
      >
      to start with a blank template.
    </p>
  </div>
  <template v-if="loadingArticles">
    <div class="max-w-fit m-auto mt-[20vh]">
      <MaxLoadingSpinner class="h-24 w-24" />
    </div>
  </template>
  <template v-else>
    <div class="py-6">
      <div class="flex justify-between mb-4">
        <h3 class="font-semibold text-lg">
          Manage Existing Products ({{ filterArticles().length }})
        </h3>
        <div v-if="filterArticles().length > 0" class="flex items-center">
          <input
            id="showDrafts"
            v-model="showOnlyDrafts"
            type="checkbox"
            name="showDrafts"
            value="Drafts"
            @change="filterArticles()"
          />
          <label for="showDrafts" class="ml-2 text-sm">Show Drafts Only</label>
        </div>
      </div>
      <template v-if="articles.length > 0">
        <ul class="space-y-3">
          <template
            v-for="{ attributes: product } in filterArticles()"
            :key="product"
          >
            <MaxCard class="flex flex-col py-4">
              <div class="flex justify-between px-4 pb-3 text-sm">
                <div
                  class="grid grid-cols-2 gap-3 md:gap-0 md:flex md:space-x-10 self-center"
                >
                  <div class="flex flex-col">
                    <span class="text-xs uppercase">Product ID</span>
                    <span class="line-clamp-1" :title="product.doc_num">{{
                      product.doc_num
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs uppercase">TYPE</span>
                    <span class="line-clamp-1" :title="product.product_type">{{
                      product.product_type
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs uppercase">Status</span>
                    <span
                      :class="[
                        'capitalize',
                        product.state === 'draft'
                          ? 'text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow'
                          : 'line-clamp-1',
                      ]"
                      >{{ product.state }}</span
                    >
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs uppercase">Publishing Date</span>
                    <span
                      class="line-clamp-1"
                      :title="
                        dayjs(product.date_published).format('MMMM D, YYYY')
                      "
                      >{{
                        dayjs(product.date_published).format("MMMM D, YYYY")
                      }}</span
                    >
                  </div>
                </div>
                <div class="hidden lg:flex space-x-4">
                  <button
                    class="min-w-[125px] flex px-3 py-2 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25 hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900"
                  >
                    <PencilSquareIcon class="h-5 w-5" /><span class="pl-3"
                      >Edit</span
                    >
                  </button>
                  <button
                    class="min-w-[125px] flex px-3 py-2 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25 hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900"
                    @click.prevent="openPreviewDialog(product)"
                  >
                    <DocumentMagnifyingGlassIcon class="h-5 w-5" /><span
                      class="pl-3"
                      >Preview</span
                    >
                  </button>
                </div>
                <div class="flex h-fit lg:hidden space-x-4">
                  <tippy content="Edit Product">
                    <button
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                    >
                      <PencilSquareIcon class="h-6 w-6" />
                    </button>
                  </tippy>
                  <tippy content="Preview Product">
                    <button
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                      @click.prevent="openPreviewDialog(product)"
                    >
                      <DocumentMagnifyingGlassIcon class="h-6 w-6" />
                    </button>
                  </tippy>
                </div>
              </div>
              <div
                class="flex flex-col md:flex-row px-4 pt-4 border-t border-slate-900/10 dark:border-slate-700/75 energy:border-zinc-700/75"
              >
                <div class="relative pb-4 md:pb-0 md:pr-4">
                  <ProductImage
                    :class="[
                      product.images.length > 0 ? 'cursor-pointer' : null,
                      'h-[140px] w-full sm:h-[170px] sm:w-[510px] md:h-[75px] md:w-[225px] lg:h-[100px] lg:w-[300px] xl:h-[135px] xl:w-[405px]',
                    ]"
                    :product="product"
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
                      class="mb-1 font-medium line-clamp-4 lg:line-clamp-3 xl:line-clamp-2 hover:underline wrap-anywhere"
                      :title="product.title"
                    >
                      {{
                        product.title_classif && product.title_classif !== "X"
                          ? `(${product.title_classif})`
                          : ""
                      }}
                      {{ product.title }}
                    </h4>
                  </router-link>
                  <p class="hidden text-sm md:line-clamp-4 wrap-anywhere">
                    {{
                      product.summary_classif && product.summary_classif !== "X"
                        ? `(${product.summary_classif})`
                        : ""
                    }}
                    {{ product.summary }}
                  </p>
                </div>
              </div>
            </MaxCard>
          </template>
        </ul>
        <MaxDialog
          :isOpen="isPreviewThumbnailDialogOpen"
          :title="'Thumbnail Preview'"
          class="max-w-fit"
          @close="closePreviewThumbnailDialog"
        >
          <div
            id="img-container"
            class="m-2 relative overflow-hidden w-[375px] h-[125px] sm:w-[450px] sm:h-[150px] md:w-[600px] md:h-[200px] lg:w-[900px] lg:h-[300px]"
          >
            <ProductImage
              :product="selectedArticle"
              class="inset-x-0 absolute h-full mx-auto z-[3]"
            />
          </div>
        </MaxDialog>
        <MaxDialog
          class="max-w-[1300px]"
          :isOpen="isPreviewDialogOpen"
          @close="closePreviewDialog"
        >
          <template v-if="loadingPreview"
            ><div class="max-w-fit m-auto">
              <MaxLoadingSpinner class="h-20 w-20" /></div
          ></template>
          <template v-else>
            <ProductContent :product="previewProduct" isPreview />
          </template>
        </MaxDialog>
      </template>
      <template v-else>
        <p class="pt-2 italic">No articles found.</p>
      </template>
    </div>
  </template>
</template>

<script>
import { productDetails } from "@/data";
import * as dayjs from "dayjs";
import axios from "@/config/wireAxios";
import { metadata } from "@/config";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  CalendarIcon,
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import ProductContent from "@/components/ProductContent";
import ProductImage from "@/components/ProductImage";

export default {
  components: {
    CalendarIcon,
    DocumentMagnifyingGlassIcon,
    PencilSquareIcon,
    ProductContent,
    ProductImage,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const routeDate = computed(() => route.params.date);
    const selectedDate = ref();
    const loadingPreview = ref(true);
    const previewProduct = ref(null);
    const loadingCriteria = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const articles = computed(() => store.state.wires.articles);
    const loadingArticles = computed(() => store.state.wires.loading);
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const showOnlyDrafts = ref(false);
    const filterArticles = () => {
      if (showOnlyDrafts.value) {
        return articles.value.filter((a) => a.attributes.state === "draft");
      } else {
        return articles.value;
      }
    };
    const isPreviewDialogOpen = ref(false);
    const closePreviewDialog = () => {
      isPreviewDialogOpen.value = false;
    };
    const openPreviewDialog = (product) => {
      console.log("product:", product);
      loadingPreview.value = true;
      if (process.env.NODE_ENV === "low") {
        let documentMatch = productDetails.find(
          ({ data }) => data.doc_num === product.doc_num
        );
        previewProduct.value = documentMatch.data;
        setTimeout(() => (loadingPreview.value = false), 750);
      } else {
        axios
          .get(`/documents/${route.params.doc_num}/preview.json`)
          .then((response) => {
            loadingPreview.value = false;
            previewProduct.value = response.data;
          });
      }
      isPreviewDialogOpen.value = true;
    };

    const defaultPayload = {
      document_action: "create",
      //dissem_orgs: ["DNI"],
      html_body: "<p></p>",
      producing_office: "DNI/NCTC",
      publication_number: Math.floor(100000 * Math.random() * 900000),
      product_type_id: 10376,
      title: "Draft Document Title",
      topics: ["TERR"],
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

    const goToArticle = (payload) => {
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
        axios.post("/articles/processDocument", payload).then((response) => {
          console.log("/articles/processDocument :", response);
          router.push({
            name: "edit",
            params: {
              date: route.params.date,
              id: response.data.article.id,
              doc_num: response.data.doc_num,
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

    const selectedArticle = ref({});
    const isPreviewThumbnailDialogOpen = ref(false);
    const openPreviewThumbnailDialog = (article) => {
      selectedArticle.value = article;
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
      loadingPreview,
      previewProduct,
      articles,
      loadingArticles,
      isCommunityExclusive,
      showOnlyDrafts,
      filterArticles,
      availableProductTypes,
      goToArticle,
      selectDate,
      canEditProduct,
      selectedArticle,
      isPreviewDialogOpen,
      closePreviewDialog,
      openPreviewDialog,
      isPreviewThumbnailDialogOpen,
      openPreviewThumbnailDialog,
      closePreviewThumbnailDialog,
    };
  },
};
</script>

<style scoped lang="scss"></style>
