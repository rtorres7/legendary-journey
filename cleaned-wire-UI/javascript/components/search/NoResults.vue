<template>
  <div>
    <div class="d-flex justify-content-center mt-8 sorry-text">
      Sorry, we didn't find any results.
    </div>
    <div
      class="d-flex justify-content-center flex-wrap sorry-text-sub mt-4"
      v-if="featuresAvailable.advancedTipsLink"
    >
      <div>
        Here's some information about our keyword search that might help you
        find what you're looking for:
      </div>
      <AdvancedTipsLink class="ml-3 advanced-tips-link" />
    </div>
  </div>
</template>

<script>
import AdvancedTipsLink from "@shared/AdvancedTipsLink";
import { mapState } from "vuex";

export default {
  name: "NoResults",
  components: { AdvancedTipsLink },
  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
  },
};
</script>

<style scoped lang="scss">
.sorry-text {
  font-size: $font-size-7;
}

.sorry-text-sub {
  color: $alt-800;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .advanced-tips-link {
    padding-bottom: $spacer-6;
  }
}
</style>
