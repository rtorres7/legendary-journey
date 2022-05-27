<template>
  <b-col v-bind="sizes">
    <WireRadioGroup query="poa_product" :label="label" />
  </b-col>
</template>

<script>
import WireRadioGroup from "./WireRadioGroup";

export default {
  name: "ProgramOfAnalysis",
  components: { WireRadioGroup },
  props: {
    label: {
      type: String,
      default: "_temp_190",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
};
</script>

<style scoped></style>
