<template>
  <component :is="computedComponent" />
</template>
<script>
import { computed } from "vue";
import LowClassifier from "@current/components/max-ui/core/LowClassifier.vue";
import HighClassifier from "@current/components/max-ui/core/HighClassifier.vue";

export default {
  components: {
    LowClassifier,
    HighClassifier,
  },
  setup() {
    const computedComponent = computed(() =>
      import.meta.env.MODE !== "production" &&
      import.meta.env.MODE !== "development"
        ? "LowClassifier"
        : "HighClassifier"
    );
    return {
      computedComponent,
    };
  },
};
</script>
