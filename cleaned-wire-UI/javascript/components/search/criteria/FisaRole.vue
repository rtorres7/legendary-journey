<template>
  <b-col v-bind="sizes">
    <WireRadioGroup query="fisa_role[]" :label="label" :options="options" />
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import WireRadioGroup from "./WireRadioGroup";

export default {
  name: "FisaRole",
  components: { WireRadioGroup },
  props: {
    label: {
      type: String,
      default: "Fisa Role",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },

  computed: {
    ...mapState("metadata/criteria/fisaRole", {
      fisaRole: "values",
    }),
    options() {
      let options = [];
      this.fisaRole.forEach((role) => {
        options.push({
          value: role.code,
          text: role.name,
          type: "fisa_role[]",
        });
      });
      return options;
    },
  },
};
</script>

<style scoped></style>
