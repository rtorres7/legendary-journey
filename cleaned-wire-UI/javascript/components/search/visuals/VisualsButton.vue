<template>
  <b-button :pressed.sync="selected">{{ displayValue }}</b-button>
</template>
<script>
import urlStore from "@shared/mixins/urlStore";
export default {
  name: "VisualsButton",
  props: ["displayValue"],
  mixins: [urlStore],

  mounted() {
    const mediaTags = this.$route.query["media_tags[]"];
    if (mediaTags && mediaTags.includes(this.queryValue)) {
      return;
    }
    this.selected = true;
  },

  beforeDestroy() {
    this.selected = false;
  },
};
</script>
