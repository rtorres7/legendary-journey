<template>
  <div
    class="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between py-6 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <div class="flex flex-col space-y-4">
      <h1 class="font-semibold text-2xl">Manage Products</h1>
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
    <template v-if="!isCommunityExclusive">
      <div class="mb-6">
        <h3 class="font-semibold text-lg">Create a Product</h3>
        <p>Start with a blank template</p>
      </div>
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-4 w-fit mb-6">
        <MaxCard
          class="flex justify-center items-center font-medium cursor-pointer"
          hoverable
          tabindex="0"
          role="button"
          aria-label="Create a blank template"
          @click="goToArticle()"
          @keyup.enter="goToArticle()"
        >
          <span
            class="z-5 px-6 py-8 lg:px-9 lg:py-10 text-xl lg:text-2xl font-bold"
          >
            New Product
          </span>
        </MaxCard>
      </div>
    </template>
    <div class="mb-6">
      <p>
        <template v-if="!isCommunityExclusive">
          Alternatively, you can select from one of the existing
          <button
            class="hover:cursor-pointer underline"
            @click="openTemplateDialog"
          >
            templates
          </button>
          to get started
        </template>
        <template v-else>
          As a community poster, select the following
          <button
            class="hover:cursor-pointer underline"
            @click="openTemplateDialog"
          >
            template
          </button>
          to create a product
        </template>
      </p>
    </div>
    <div
      class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-fit mb-6"
    >
      <template v-for="product in availableProductTypes" :key="product">
        <MaxCard
          class="flex justify-center items-center font-medium cursor-pointer"
          hoverable
          tabindex="0"
          role="button"
          :aria-label="`Create a ${product.displayName}`"
          @click="
            dialogPreference == 'hide'
              ? goToArticle(product.payload)
              : openProductTemplateDialog(product)
          "
          @keyup.enter="
            dialogPreference == 'hide'
              ? goToArticle(product.payload)
              : openProductTemplateDialog(product)
          "
        >
          <span
            class="z-5 px-6 py-8 lg:px-9 lg:py-10 text-center text-md md:text-lg font-bold"
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
        <div class="flex items-center">
          <input
            id="showDrafts"
            v-model="showOnlyDrafts"
            type="checkbox"
            name="showDrafts"
            value="Drafts"
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
                  class="grid grid-cols-2 gap-3 md:gap-0 md:flex md:space-x-8 lg:space-x-10 self-center"
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
                  <router-link
                    :to="{
                      name: 'edit',
                      params: {
                        date: routeDate,
                        id: product.id,
                        doc_num: product.doc_num,
                      },
                    }"
                    class="min-w-[110px] xl:min-w-[125px] flex px-3 py-2 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25 hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900"
                  >
                    <PencilSquareIcon class="h-5 w-5" /><span class="pl-3"
                      >Edit</span
                    >
                  </router-link>
                  <template v-if="!restrictedProduct(product)">
                    <button
                      class="min-w-[110px] xl:min-w-[125px] flex px-3 py-2 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25 hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900"
                      @click.prevent="openPreviewDialog(product)"
                    >
                      <DocumentMagnifyingGlassIcon class="h-5 w-5" /><span
                        class="pl-3"
                        >Preview</span
                      >
                    </button>
                    <button
                      class="min-w-[110px] xl:min-w-[125px] flex px-3 py-2 border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25 hover:bg-slate-50 dark:hover:bg-slate-900 energy:hover:bg-zinc-900"
                      @click.prevent="openDeleteDialog(product)"
                    >
                      <TrashIcon class="h-5 w-5" /><span class="pl-3"
                        >Delete</span
                      >
                    </button>
                  </template>
                </div>
                <div class="flex h-fit lg:hidden space-x-4">
                  <tippy content="Edit Product">
                    <router-link
                      :to="{
                        name: 'edit',
                        params: {
                          date: routeDate,
                          id: product.id,
                          doc_num: product.doc_num,
                        },
                      }"
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                    >
                      <PencilSquareIcon class="h-6 w-6" />
                    </router-link>
                  </tippy>
                  <tippy content="Preview Product">
                    <button
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                      aria-label="Preview product"
                      @click.prevent="openPreviewDialog(product)"
                    >
                      <DocumentMagnifyingGlassIcon class="h-6 w-6" />
                    </button>
                  </tippy>
                  <tippy content="Delete Product"
                    ><button
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                      aria-label="Delete product"
                      @click.prevent="openDeleteDialog(product)"
                    >
                      <TrashIcon class="h-6 w-6" /></button
                  ></tippy>
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
                  <ProductRestrictedLink :product="product">
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
                  </ProductRestrictedLink>
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
        <MaxDialog
          :isOpen="isDeleteDialogOpen"
          :title="'Delete Product'"
          class="max-w-fit"
          @close="closeDeleteDialog"
        >
          <p class="py-4 pr-4">Are you sure you want to do this?</p>
          <template #actions>
            <MaxButton color="secondary" @click.prevent="closeDeleteDialog"
              >Cancel</MaxButton
            >
            <MaxButton color="danger" @click.prevent="deleteProduct">
              Delete
            </MaxButton>
          </template>
        </MaxDialog>
      </template>
      <template v-else>
        <p class="pt-2 italic">No products found.</p>
      </template>
      <MaxDialog
        :isOpen="isTemplateDialogOpen"
        :title="'Templates'"
        class="max-w-[700px]"
        @close="closeTemplateDialog"
      >
        <div class="pb-8">
          <p class="font-semibold pb-2">What is a template?</p>
          <p class="text-sm">
            A template is a collection of prepopulated fields. When a template
            is selected, a draft of the product will be created and stored in
            our system with the template applied, so there is not a need to save
            the product immediately.
          </p>
        </div>
        <p class="font-semibold pb-2">Template Preview:</p>
        <p class="text-sm pb-4">
          Select a product type from the dropdown below to preview its template
          contents:
        </p>
        <MaxListbox
          v-model="selectedProductType"
          :label="'Product Type'"
          :items="availableProductTypes"
          class="lg:w-1/2 pb-4"
        />
        <p class="italic text-sm pb-8">
          Preview only shows fields that are prepopulated by the template
        </p>
        <div v-if="productContent" class="flex flex-col gap-y-4">
          <div v-if="productContent.title" class="flex">
            <p class="basis-1/5 font-semibold">Title:</p>
            <p class="basis-4/5">{{ productContent.title }}</p>
          </div>
          <div v-if="productContent.summary" class="flex">
            <p class="basis-1/5 font-semibold">Summary:</p>
            <p class="basis-4/5">{{ productContent.summary }}</p>
          </div>
          <div v-if="productContent.topics" class="flex">
            <p class="basis-1/5 font-semibold">Topics:</p>
            <p class="basis-4/5">{{ getTopicNames(productContent) }}</p>
          </div>
          <div v-if="productContent.poc_info" class="flex">
            <p class="basis-1/5 font-semibold">POC Info:</p>
            <p class="basis-4/5">{{ productContent.poc_info }}</p>
          </div>
        </div>
      </MaxDialog>
      <MaxDialog
        :isOpen="isProductTemplateDialogOpen"
        :title="
          productContent ? `${selectedProductType.displayName} Template` : ''
        "
        class="max-w-[700px]"
        @close="closeProductTemplateDialog"
      >
        <p class="font-semibold pb-2">Template Preview:</p>
        <p class="italic text-sm pb-8">
          Preview only shows fields that are prepopulated by the template
        </p>
        <div v-if="productContent" class="flex flex-col gap-y-4">
          <div v-if="productContent.title" class="flex">
            <p class="basis-1/5 font-semibold">Title:</p>
            <p class="basis-4/5">{{ productContent.title }}</p>
          </div>
          <div v-if="productContent.summary" class="flex">
            <p class="basis-1/5 font-semibold">Summary:</p>
            <p class="basis-4/5">{{ productContent.summary }}</p>
          </div>
          <div v-if="productContent.topics" class="flex">
            <p class="basis-1/5 font-semibold">Topics:</p>
            <p class="basis-4/5">{{ getTopicNames(productContent) }}</p>
          </div>
          <div v-if="productContent.poc_info" class="flex">
            <p class="basis-1/5 font-semibold">POC Info:</p>
            <p class="basis-4/5">{{ productContent.poc_info }}</p>
          </div>
        </div>
        <div class="flex pt-8">
          <input
            id="hideDialog"
            v-model="hideDialog"
            type="checkbox"
            name="hideDialog"
          />
          <label for="hideDialog" class="ml-2 text-sm"
            >Do not show this again</label
          >
        </div>
        <template #actions>
          <MaxButton
            color="secondary"
            @click.prevent="closeProductTemplateDialog"
            >Cancel</MaxButton
          >
          <MaxButton color="secondary" @click="goToArticle(productContent)">
            Create
          </MaxButton>
        </template>
      </MaxDialog>
    </div>
  </template>
</template>

<script>
import { productDetails } from "@/data";
import dayjs from "dayjs/esm/index.js";
import { useCookies } from "vue3-cookies";
import axios from "@/config/wireAxios";
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  CalendarIcon,
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import ProductRestrictedLink from "@/components/ProductRestrictedLink.vue";
import { getValueForCode, hasProductAccess } from "@/helpers";
import ProductContent from "@/components/ProductContent.vue";
import ProductImage from "@/components/ProductImage.vue";

export default {
  components: {
    CalendarIcon,
    DocumentMagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ProductContent,
    ProductImage,
    ProductRestrictedLink,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const metadata = inject("metadata");
    const routeDate = computed(() => route.params.date);
    const selectedDate = ref();
    const loadingPreview = ref(true);
    const previewProduct = ref(null);
    const loadingCriteria = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const articles = computed(() => store.state.wires.articles);
    const organization = computed(() => store.getters["user/organization"]);
    const loadingArticles = computed(() => store.state.wires.loading);
    const createNotification = inject("create-notification");
    const { cookies } = useCookies();
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const showOnlyDrafts = ref(false);
    const drafts = computed(() =>
      articles.value.filter((a) => a.attributes.state === "draft")
    );
    const filterArticles = () => {
      if (showOnlyDrafts.value) {
        return !isCommunityExclusive.value
          ? drafts.value
          : drafts.value.filter(
              (a) => a.attributes.product_type === "Community Product"
            );
      } else {
        return !isCommunityExclusive.value
          ? articles.value
          : articles.value.filter(
              (a) => a.attributes.product_type === "Community Product"
            );
      }
    };

    const restrictedProduct = (product) => {
      let productToCheck = product;
      if (import.meta.env.MODE === "offline") {
        let documentMatch = productDetails.find(
          ({ data }) => data.doc_num === product.doc_num
        );
        productToCheck = documentMatch.data;
      }
      if (hasProductAccess(productToCheck, organization.value)) {
        return false;
      }
      return true;
    };

    const selectedProductType = ref();
    const productContent = computed(() => selectedProductType.value?.payload);
    const getTopicNames = (product) => {
      const topics = [];
      product.topics.forEach((topic) => {
        let topicValue = getValueForCode(criteria.value.topics, topic);
        topics.push(topicValue.name);
      });
      return topics.join(", ");
    };
    const isTemplateDialogOpen = ref(false);
    const closeTemplateDialog = () => {
      isTemplateDialogOpen.value = false;
    };
    const openTemplateDialog = () => {
      selectedProductType.value = null;
      isTemplateDialogOpen.value = true;
    };
    const hideDialog = ref();
    const saveHideDialog = () => {
      if (hideDialog.value) {
        cookies.set("templateDialogs", "hide", "90d");
      }
    };
    const dialogPreference = ref(cookies.get("templateDialogs"));
    const isProductTemplateDialogOpen = ref(false);
    const closeProductTemplateDialog = () => {
      isProductTemplateDialogOpen.value = false;
    };
    const openProductTemplateDialog = (product) => {
      selectedProductType.value = product;
      isProductTemplateDialogOpen.value = true;
    };
    const isPreviewDialogOpen = ref(false);
    const closePreviewDialog = () => {
      isPreviewDialogOpen.value = false;
    };
    const openPreviewDialog = (product) => {
      loadingPreview.value = true;
      if (import.meta.env.MODE === "offline") {
        let documentMatch = productDetails.find(
          ({ data }) => data.doc_num === product.doc_num
        );
        previewProduct.value = documentMatch.data;
        setTimeout(() => (loadingPreview.value = false), 750);
      } else {
        axios
          .get(`/documents/${product.doc_num}/preview.json`)
          .then((response) => {
            loadingPreview.value = false;
            previewProduct.value = response.data;
          });
      }
      isPreviewDialogOpen.value = true;
    };

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
          message: `Product ${selectedProduct.value.doc_num} has been deleted.`,
          type: "success",
        });
        closeDeleteDialog();
        //need to delete product from both the drafts array and the articles array
        //drafts
        let draft = drafts.value.find(
          (d) => d.attributes.doc_num == selectedProduct.value.doc_num
        );
        let indexOfDraft = drafts.value.indexOf(draft);
        drafts.value.splice(indexOfDraft, 1);
        //articles
        let article = articles.value.find(
          (a) => a.attributes.doc_num == selectedProduct.value.doc_num
        );
        let indexOfArticle = articles.value.indexOf(article);
        articles.value.splice(indexOfArticle, 1);
      } else {
        axios
          .delete("/documents/" + selectedProduct.value.doc_num + "/deleteMe")
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
                message: `Product ${selectedProduct.value.doc_num} has been deleted.`,
                type: "success",
              });
              closeDeleteDialog();
              let draft = drafts.value.find(
                (d) => d.attributes.doc_num == selectedProduct.value.doc_num
              );
              let indexOfDraft = drafts.value.indexOf(draft);
              drafts.value.splice(indexOfDraft, 1);
              let article = articles.value.find(
                (a) => a.attributes.doc_num == selectedProduct.value.doc_num
              );
              let indexOfArticle = articles.value.indexOf(article);
              articles.value.splice(indexOfArticle, 1);
            }
          });
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
      saveHideDialog();
      if (import.meta.env.MODE === "offline") {
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
      router.push({ name: "products", params: { date } });
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
        if (route.name === "products") {
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
      drafts,
      filterArticles,
      restrictedProduct,
      availableProductTypes,
      goToArticle,
      selectDate,
      canEditProduct,
      selectedArticle,
      selectedProductType,
      productContent,
      getTopicNames,
      isTemplateDialogOpen,
      openTemplateDialog,
      closeTemplateDialog,
      hideDialog,
      saveHideDialog,
      dialogPreference,
      isProductTemplateDialogOpen,
      openProductTemplateDialog,
      closeProductTemplateDialog,
      isPreviewDialogOpen,
      closePreviewDialog,
      openPreviewDialog,
      isPreviewThumbnailDialogOpen,
      openPreviewThumbnailDialog,
      closePreviewThumbnailDialog,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
      deleteProduct,
    };
  },
};
</script>

<style scoped lang="scss"></style>
