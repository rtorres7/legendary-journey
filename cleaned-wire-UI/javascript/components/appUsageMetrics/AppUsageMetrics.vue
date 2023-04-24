<template>
  <div class="mt-6 standard-page-margin">
    <Markdown :markdown-text="markdownText" />
  </div>
</template>

<script>
import AppUsageMetricsMd from "../../assets/app_usage_metrics.md";
import Markdown from "@shared/Markdown";

export default {
  name: "AppUsageMetrics",
  components: { Markdown },
  data() {
    return {
      markdownText: AppUsageMetricsMd,
    };
  },
};
</script>
