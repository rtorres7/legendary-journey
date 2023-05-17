<template>
  <component :is="computedComponent" />
</template>
<script>
import { computed } from "vue";
import LowClassifier from "@/components/max-ui/core/LowClassifier";
import HighClassifier from "@/components/max-ui/core/HighClassifier";

export default {
  components: {
    LowClassifier,
    HighClassifier,
  },
  setup() {
    const computedComponent = computed(() =>
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "development"
        ? "LowClassifier"
        : "HighClassifier"
    );
    return {
      computedComponent,
    };
  },
};
</script>
