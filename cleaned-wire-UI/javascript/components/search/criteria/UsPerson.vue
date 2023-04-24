<template>
  <b-col v-bind="sizes">
    <WireRadioGroup query="us_person_info" :label="label" />
  </b-col>
</template>

<script>
import WireRadioGroup from "./WireRadioGroup";

export default {
  name: "UsPerson",
  components: { WireRadioGroup },
  props: {
    label: {
      type: String,
      default: "US Person(s)",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
};
</script>

<style scoped></style>
