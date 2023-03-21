<template>
  <template v-if="loadingMetadata || loadingProduct">
    <div class="animate-pulse">
      <p
        class="h-8 w-40 my-4 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
      ></p>
      <div
        class="h-[720px] mt-4 bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700"
      />
    </div>
  </template>
  <template v-else>
    <template v-if="canEditProduct(product.product_type_id)">
      <p
        class="font-semibold text-2xl py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
      >
        Edit Product
      </p>
      <EditProductForm :product="product" :documentNumber="documentNumber" />
    </template>
    <template v-else>
      <NotAuthorized />
    </template>
  </template>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "@/config/wireAxios";
import { mockDocument } from "@/data";
import EditProductForm from "@/components/EditProductForm";
import NotAuthorized from "@/components/NotAuthorized";

export default {
  components: {
    EditProductForm,
    NotAuthorized,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const createNotification = inject("create-notification");
    const documentNumber = route.params.doc_num;
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const loadingMetadata = computed(() => store.state.metadata.loading);
    const loadingProduct = ref(true);
    const product = ref({
      control_to: [],
      coordinators: [],
      producing_offices: [],
      countries: [],
      dissem_orgs: [],
      images: [],
      topics: [],
      non_state_actors: [],
      title: "",
      title_classif: "",
      title_classif_xml: "",
      summary: "",
      summary_classif: "",
      summary_classif_xml: "",
      html_body: "",
      classification: "",
      classification_xml: "",
      classification_decl_fmt: "",
      doc_num: "",
      attachments: [],
      date_published: "",
      poc_info: "",
      publication_number: "",
      product_type_id: null,
      worldwide: null,
    });

    onMounted(() => {
      if (process.env.NODE_ENV === "low") {
        setTimeout(() => {
          console.log("document/getDocument: ", mockDocument);
          product.value = mockDocument;
          loadingProduct.value = false;
        }, 1000);
      } else {
        axios
          .get(
            "/wires/" +
              route.params.date +
              "/articles/" +
              route.params.id +
              "/getDocumentData",
            {
              date: route.params.date,
              id: route.params.id,
            }
          )
          .then((response) => {
            loadingProduct.value = false;
            if (response.data) {
              product.value = response.data;
            } else {
              createNotification({
                title: "Error",
                message: "There was an error retrieving the product data.",
                type: "error",
                autoClose: false,
              });
            }
          });
      }
    });

    const canEditProduct = (product_type_id) => {
      if (!isCommunityExclusive.value) {
        return true;
      } else {
        if (product_type_id === 10378) {
          return true;
        }
        return false;
      }
    };

    return {
      documentNumber,
      loadingMetadata,
      loadingProduct,
      product,
      canEditProduct,
    };
  },
};
</script>
