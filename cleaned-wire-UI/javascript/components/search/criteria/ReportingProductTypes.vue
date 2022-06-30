<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import WireSelect from "./WireSelect";
import { mapGetters, mapState } from "vuex";
export default {
  name: "ReportingProductTypes",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Reporting & Product Types",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/reportingTypes", {
      reportingTypes: "values",
    }),
    ...mapGetters("metadata/criteria/productTypes", {
      getProductTypeForCode: "getValueForCode",
    }),

    options() {
      let options = [];
      this.reportingTypes.forEach((reportingType) => {
        options.push({
          value: reportingType.code,
          text: reportingType.name,
          type: "reporting_types[]",
          children: true,
        });
        reportingType.productTypes.forEach((productTypeCode) => {
          const productType = this.getProductTypeForCode(productTypeCode);
          options.push({
            value: productType.code,
            text: productType.name,
            indent: true,
            type: "product_types[]",
          });
        });
      });
      return options;
    },
  },
};
</script>

<style scoped></style>
