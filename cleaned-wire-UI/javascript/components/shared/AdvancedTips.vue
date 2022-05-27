<template>
  <div class="mt-6 standard-page-margin">
    <Markdown :markdown-text="markdownText" />
  </div>
</template>

<script>
import AdvancedTipsMd from "../../assets/advanced_tips.md";
import Markdown from "@shared/Markdown";

export default {
  name: "AdvancedTips",
  components: { Markdown },
  data() {
    return {
      markdownText: AdvancedTipsMd,
    };
  },
};
</script>
