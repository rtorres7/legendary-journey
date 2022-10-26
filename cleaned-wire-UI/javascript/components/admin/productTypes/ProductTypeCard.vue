<template>
  <div class="mr-7 mt-6">
    <div class="d-flex separator">
      <b-btn
        class="product-title pl-0"
        variant="link"
        :id="'product-details-' + productType.id + '_btn'"
        v-b-toggle="'product-details' + productType.id"
      >
        {{ productType.name }} <span class="sr-only"> product type</span>
      </b-btn>
      <div class="d-flex align-items-center ml-auto">
        <DeleteButton
          :_temp_1="'/admin/product_types/' + productType.id"
          :label="productType.name"
          type="productType"
          :caller="this"
        />
      </div>
      <b-button variant="link" size="sm" @click="showEditModal">
        <img :src="require('@assets/edit.svg')" alt="edit product type" />
      </b-button>

      <ProductTypeModal
        ref="editModal"
        :editFlag="true"
        :reportingTypes="reportingTypes"
        :productType="productType"
        @productTypeUpdated="updatedProductType"
      />
    </div>

    <b-collapse
      :id="'product-details' + productType.id"
      accordion="product-accordion"
      @shown="updateFocus(`#product-details-${productType.id}_btn`)"
    >
      <div class="reporting-type">
        {{ productType.reporting_type_display_name }}
      </div>
      <div class="dates">
        Created: {{ formatDate(productType.created_at) }} Updated:
        {{ formatDate(productType.updated_at) }}
      </div>
      <div class="pt-2 congress-view" v-if="productType.congress">
        This product type is viewable by Congress
      </div>
    </b-collapse>
  </div>
</template>

<script>
import DeleteButton from "../../shared/DeleteButton";
import ProductTypeModal from "./ProductTypeModal";

export default {
  name: "ProductTypeCard",
  components: { DeleteButton, ProductTypeModal },
  props: {
    productType: {
      type: Object,
      required: true,
    },
    reportingTypes: {
      required: true,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {},
  methods: {
    updateFocus(accordionSelector) {
      document.querySelector(accordionSelector).focus();
    },
    deleted() {
      this.$wireNotification({
        title: "Product Type Deleted",
        duration: 5000,
        text: "Product Type '" + this.productType.name + "' has been deleted",
        type: "success",
      });
      this.$emit("productTypeDeleted");
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Product type deletion failed",
        duration: 5000,
        text: "Failed to delete product type '" + this.productType.name + "'",
        type: "error",
      });
      this.$emit("productTypeDeleted");
    },
    updatedProductType() {
      this.$emit("productTypeUpdated");
    },
    showEditModal() {
      this.$refs.editModal.showModal = true;
    },
    formatDate(value) {
      return this.$moment(value, "YYYY/MM/DD HH:mm:ss").format(
        "MMMM DD, YYYY HH:mm"
      );
    },
  },
};
</script>

<style scoped lang="scss">
.reporting-type {
  font-size: $font-size-3;
  font-family: "Roboto Condensed";
  color: $pri-600;
  text-transform: uppercase;
}
.dates {
  font-size: $font-size-2;
  font-family: "Roboto Condensed";
  color: $alt-800;
  text-transform: uppercase;
}

img {
  height: 16px;
  width: 16px;
}
.product-title {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.congress-view {
  color: $pri-600;
  font-style: italic;
}
</style>
