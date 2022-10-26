<template>
  <div class="mt-6 standard-page-margin">
    <div v-if="hasError">
      <NotFound />
    </div>
    <div v-else>
      <vanity-title title="Product Types"></vanity-title>
      <b-container fluid>
        <b-row>
          <b-col cols="24">
            <b-form @submit.prevent="">
              <b-form-group>
                <b-row>
                  <b-col cols="6">
                    <label class="pt-4">Product Name</label>
                    <b-form-input
                      debounce="700"
                      aria-label="Product Name"
                      v-model="productName"
                    />
                  </b-col>
                  <b-col cols="6">
                    <label class="pt-4">Filter by Reporting Type</label>
                    <b-form-select
                      id="reporting-type-dd"
                      @input="loadProductTypes(1)"
                      v-model="reportingType"
                      :options="reportingTypes"
                      aria-label="Reporting Type Filter"
                    />
                  </b-col>

                  <b-col
                    cols="12"
                    class="d-flex justify-content-end align-items-center createButton"
                  >
                    <b-btn
                      @click="showCreateModal"
                      class="mt-7"
                      variant="primary"
                      >Create New Product Type
                    </b-btn>
                    <ProductTypeModal
                      ref="createModal"
                      :reportingTypes="reportingTypes"
                      @productTypeCreated="createdProductType"
                    />
                  </b-col>
                </b-row>
              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
        <div
          v-if="loading"
          class="d-flex justify-content-center align-items-center loading-area"
        >
          <spinner />
        </div>

        <b-row class="mt-8 mb-8 product-list" v-else>
          <b-col
            cols="24"
            lg="12"
            v-for="productType in this.productTypes"
            :key="productType.id"
          >
            <ProductTypeCard
              class="productCard"
              :productType="productType"
              :reportingTypes="reportingTypes"
              @productTypeDeleted="deletedProductType"
              @productTypeUpdated="updatedProductType"
            />
          </b-col>
        </b-row>
        <div class="d-flex justify-content-center mb-5" v-if="this.pages > 1">
          <b-pagination-nav
            :link-gen="paginationLink"
            :number-of-pages="this.pages"
            @change="loadProductTypes"
            v-model="currentPageNum"
          ></b-pagination-nav>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VanityTitle from "../../vanity/VanityTitle";
import NotFound from "@shared/errors/NotFound";
import ProductTypeCard from "./ProductTypeCard";
import ProductTypeModal from "./ProductTypeModal";
import Spinner from "../../shared/Spinner";

export default {
  name: "ProductTypes",
  components: {
    ProductTypeCard,
    ProductTypeModal,
    Spinner,
    VanityTitle,
    NotFound,
  },
  data() {
    return {
      reportingType: "",
      productName: null,
      reportingTypes: null,
      loading: false,
      productTypes: null,
      pages: 0,
      searchTextTimeout: null,
      hasError: null,
    };
  },
  mounted() {
    this.loadProductTypes();
    if (document.querySelector("#reporting-type-dd")) {
      document.querySelector("#reporting-type-dd").focus();
    }
  },
  computed: {},
  methods: {
    loadProductTypes(pageNum) {
      this.loading = true;
      axios
        .get("/admin/product_types/", {
          params: {
            page: pageNum || this.$route.query.page || 1,
            named: this.productName || "",
            reporting_type_id: this.reportingType || "",
          },
        })
        .then((response) => {
          this.hasError = false;
          this.productTypes = response.data.productTypes;
          this.buildReportingTypeSelects(response.data.reportingTypes);
          this.pages = response.data.pageCount;
          this.currentPageNum = response.data.currentPageNum;
          this.loading = false;
        })
        .catch(() => {
          this.hasError = true;
        });
    },
    deletedProductType() {
      if (this.productTypes.length === 1) {
        this.loadProductTypes(this.currentPageNum - 1);
      } else {
        this.loadProductTypes(this.currentPageNum);
      }
    },
    createdProductType() {
      this.productName = "";
      this.reportingType = "";
      this.loadProductTypes();
    },
    updatedProductType() {
      this.loadProductTypes(this.currentPageNum);
    },
    buildReportingTypeSelects(reportingTypes) {
      this.reportingTypes = [
        { value: "", text: "Choose A Reporting Type" },
      ].concat(reportingTypes);
    },
    showCreateModal() {
      this.$refs.createModal.showModal = true;
    },
    paginationLink(pageNum) {
      return {
        query: { page: pageNum },
      };
    },
  },
  watch: {
    productName() {
      this.loadProductTypes(1);
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
