<template>
  <div class="mt-6 standard-page-margin">
    <Markdown :markdown-text="markdownText" />
  </div>
</template>

<script>
import BlueKeyAdvancedTipsMd from "../../assets/bluekey-advanced-tips.md";
import CiaWireAdvancedTipsMd from "../../assets/_temp_540-advanced-tips.md";
import Markdown from "@shared/Markdown";
import { mapState } from "vuex";

export default {
  name: "AdvancedTips",
  components: { Markdown },
  computed: {
    ...mapState("metadata", ["project"]),
    markdownText() {
      return this.project == "bluekey"
        ? BlueKeyAdvancedTipsMd
        : CiaWireAdvancedTipsMd;
    },
  },
};
</script>
