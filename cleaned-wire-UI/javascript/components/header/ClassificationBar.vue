<template>
  <div class="classif" :class="{ 'non-prod': nonProduction }">
    Site content limited to: {{ siteClassification }}
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ClassificationBar",
  computed: {
    ...mapState("metadata", ["siteClassification", "nonProduction"]),
  },
};
</script>
