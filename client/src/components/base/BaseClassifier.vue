<template>
  <component :is="computedComponent" />
</template>
<script>
import { computed } from "vue";
import Classifier from "@/components/Classifier";
import HighClassifier from "@/components/high/Classifier";

export default {
  components: {
    Classifier,
    HighClassifier,
  },
  setup() {
    const computedComponent = computed(() =>
      process.env.NODE_ENV === "low" ? "Classifier" : "HighClassifier"
    );
    return {
      computedComponent,
    };
  },
};
</script>
