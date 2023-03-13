<template>
  <component :is="computedComponent" />
</template>
<script>
import { computed } from "vue";
import Classifier from "@/components/Classifier.vue";
import HighClassifier from "@/components/high/Classifier.vue";

export default {
  components: {
    Classifier,
    HighClassifier,
  },
  setup() {
    const computedComponent = computed(() =>
      import.meta.env.MODE === "low" ? "Classifier" : "HighClassifier"
    );
    return {
      computedComponent,
    };
  },
};
</script>
