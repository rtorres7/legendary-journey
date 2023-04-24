<template>
  <div>
    <div class="results" v-if="loading">Loading Results...</div>
    <div class="results" v-else>{{ resultsDisplay() }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ResultsToolbar",
  computed: {
    ...mapState("search", ["loading", "totalCount"]),
    resultsCount() {
      return this.totalCount ? this.totalCount : 0;
    },
  },
  methods: {
    notify() {
      let message = this.resultsCount.toLocaleString() + " Wire Results";
      this.$announcer.set(message);
    },
    resultsDisplay() {
      let display = this.resultsCount.toLocaleString() + " Result";
      if (this.resultsCount !== 1) {
        display += "s";
      }
      return display;
    },
  },
  watch: {
    totalCount() {
      this.notify();
    },
  },
};
</script>

<style scoped lang="scss">
.results {
  font-size: $font-size-2;
  margin-bottom: 0;
}
</style>
