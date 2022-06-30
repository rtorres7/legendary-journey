<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import WireSelect from "./WireSelect";
export default {
  name: "Classification",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Classifications",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/classification", {
      classification: "values",
    }),

    options() {
      let options = [];
      this.classification.forEach((classification) =>
        options.push({
          value: classification.code,
          text: classification.name,
          type: "classification[]",
        })
      );
      return options;
    },
  },
};
</script>

<style scoped></style>
