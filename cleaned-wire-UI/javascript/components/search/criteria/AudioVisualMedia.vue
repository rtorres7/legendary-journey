<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import WireSelect from "./WireSelect";
import { mapState } from "vuex";
export default {
  name: "AudioVisualMedia",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Media Types",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/mediaTags", { mediaTags: "values" }),

    options() {
      let options = [];
      this.mediaTags.forEach((mediaTag) => {
        options.push({
          value: mediaTag.code,
          text: mediaTag.name,
          type: "media_tags[]",
        });
      });
      return options;
    },
  },
};
</script>

<style scoped></style>
