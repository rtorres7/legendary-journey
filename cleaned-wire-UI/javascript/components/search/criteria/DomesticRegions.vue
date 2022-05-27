<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import WireSelect from "./WireSelect";
export default {
  name: "DomesticRegions",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Domestic Regions",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/domesticRegions", {
      domesticRegions: "values",
    }),
    options() {
      let options = [];
      this.domesticRegions.forEach((domesticRegion) => {
        options.push({
          value: domesticRegion.code,
          text: domesticRegion.name,
          type: "domestic_regions[]",
        });
      });
      return options;
    },
  },
};
</script>

<style scoped></style>
