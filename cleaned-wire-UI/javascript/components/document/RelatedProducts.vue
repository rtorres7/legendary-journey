<template>
  <div v-if="!loading">
    <h2 class="pri-800 separator mt-6 pb-4">Related Products</h2>
    <p v-if="products.length === 0">There are no related products.</p>
    <draggable
      tag="ol"
      :list="products"
      class="list-group pb-3"
      handle=".sort-handle"
      @change="updateRelatedDocuments"
      v-if="canManageRelatedProducts"
    >
      <li
        class="list-group-item"
        v-for="(product, idx) in products"
        :key="product.id"
      >
        <RelatedProduct
          :product="product"
          @removeProduct="removeProduct"
          canManage
        />
      </li>
    </draggable>
    <ul class="list-group" v-else>
      <li
        class="list-group-item"
        v-for="(product, idx) in products"
        :key="product.id"
      >
        <RelatedProduct :product="product" />
      </li>
    </ul>
    <b-form-group v-if="canManageRelatedProducts" class="pt-3">
      <label>Add Document by Number</label>
      <b-input class="mb-3" v-model="productDocNum"></b-input>
      <b-btn variant="secondary" class="float-right" @click="addRelatedProduct"
        >Add</b-btn
      >
      <span class="sr-only"> related product</span>
      <a
        :href="`/admin/related_products?doc_num=${docNum}&include=true`"
        class="pl-0"
        data-usage="doc-find-other-relevant"
        @keydown.space.prevent="$event.srcElement.click"
        ><span class="fa fa-search pr-3" />Find other relevant products</a
      >
    </b-form-group>
  </div>
</template>

<script>
import RelatedProduct from "../document/RelatedProduct";
import draggable from "vuedraggable";
import axios from "axios";
import { sortBy } from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "RelatedProducts",
  components: { RelatedProduct, draggable },
  data() {
    return {
      loading: true,
      products: [],
      productDocNum: "",
    };
  },
  mounted() {
    this.retrieveRelatedDocuments();
  },
  computed: {
    ...mapGetters("user", ["canManageRelatedProducts"]),
    docNum() {
      return this.$route.params["docNum"];
    },
    relatedDocPath() {
      return "/documents/" + this.docNum + "/related_documents.json";
    },
  },
  methods: {
    retrieveRelatedDocuments() {
      this.loading = true;
      axios
        .get(this.relatedDocPath)
        .then((response) => {
          this.products = response.data.relatedDocuments;
          this.loading = false;
        })
        .catch((error) => {
          this.errored = error.response.status;
          this.loading = false;
        });
    },
    removeProduct(itemId) {
      const index = this.products.findIndex((product) => product.id === itemId);
      return this.products.splice(index, 1);
    },
    addRelatedProduct() {
      axios({
        method: "post",
        _temp_1: this.relatedDocPath,
        data: { related_document: { doc_num: this.productDocNum } },
      })
        .then((response) => {
          // refresh tags section
          this.products = sortBy(response.data.relatedDocuments, ["position"]);

          this.$wireNotification({
            title: "Related Product Added",
            duration: 5000,
            text:
              this.productDocNum +
              " has been added as a related product to this article.",
            type: "success",
          });

          this.productDocNum = "";
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to add related product",
          });
        });
    },
    updateRelatedDocuments() {
      let formData = new FormData();

      this.products.forEach((product) =>
        formData.append("related_document[]", product.id)
      );

      axios({
        method: "PATCH",
        _temp_1: "/documents/" + this.docNum + "/related_documents/sort.json",
        data: formData,
      })
        .then((response) => {
          this.products = sortBy(response.data.relatedDocuments, ["position"]);
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to update related products",
          });
          this.retrieveRelatedDocuments();
        });
    },
  },
  watch: {
    $route() {
      this.retrieveRelatedDocuments();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.delete-icon {
  height: 10px;
  width: 10px;
}
.list-group-item {
  padding: 0.5rem 0;
}
</style>
