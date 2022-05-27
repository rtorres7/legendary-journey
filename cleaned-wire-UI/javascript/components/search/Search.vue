<template>
  <div>
    <VanityHeader title="Search" class="standard-page-margin" />
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import ResultsWithNav from "./ResultsWithNav";
import Pills from "./pills/Pills";
import VanityHeader from "../shared/VanityHeader";

export default {
  name: "Search.vue",

  methods: {
    ...mapActions("search", ["search"]),
  },

  components: {
    VanityHeader,
    Pills,
    ResultsWithNav,
  },

  mounted() {
    if (!this.$route.query?.view) {
      let query = Object.assign({}, this.$route.query);
      query["view"] = "list";
      this.$router.push({ query });
    }

    this.$bus.$on("clear-search", () => {
      let query = { view: this.$route.query?.view };
      this.$router.push({ name: "search", query });
      this.search();
    });

    if (this.$route.query && this.$route.query.id) {
      this.$store.commit("search/setSearchId", this.$route.query.id);
      this.$nextTick(() => {
        this.search();
      });
    } else {
      this.search();
    }
  },

  destroyed() {
    this.$bus.$off("clear-search");
  },

  beforeRouteUpdate(to, from, next) {
    if (to.query.id) {
      this.$store.commit("search/setSearchId", to.query.id);
      this.$nextTick(() => {
        next();

        this.$nextTick(() => {
          this.search();
        });
      });
    } else {
      next();

      this.$nextTick(() => {
        this.search();
      });
    }
  },
};
</script>

<style scoped lang="scss">
/deep/ .invalid-feedback {
  text-align: right;
}
</style>
