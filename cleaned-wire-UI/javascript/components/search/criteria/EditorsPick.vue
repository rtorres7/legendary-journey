<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import WireSelect from "./WireSelect";
import { mapState } from "vuex";
export default {
  name: "EditorsPick",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Front Page Featured",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/selectedFor", { selectedFor: "values" }),
    options() {
      return this.selectedFor.map((category) => {
        return {
          value: category.code,
          text: category.name,
          type: category.type || "selected_for[]",
        };
      });
    },
  },
};
</script>

<style scoped></style>
