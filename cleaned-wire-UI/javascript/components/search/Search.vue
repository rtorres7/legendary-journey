<template>
  <div v-if="!metadataLoading">
    <VanityHeader
      :showTabs="hasSDSAccess && featuresAvailable.sensitive_features"
      :startOnFss="fssTab"
      title="Search"
      class="standard-page-margin"
    />
    <div v-if="hasSDSAccess && featuresAvailable.sensitive_features">
      <div :hidden="fssTab">
        <Pills />
        <ResultsWithNav class="standard-page-margin" />
      </div>
      <div :hidden="!fssTab">
        <Pills :hideForFSS="true" />
        <CompartmentedSection />
      </div>
    </div>
    <div v-else>
      <Pills />
      <ResultsWithNav class="standard-page-margin" />
    </div>
  </div>
</template>

<script>
import CompartmentedSection from "./CompartmentedSection";
import ResultsWithNav from "./ResultsWithNav";
import Pills from "./pills/Pills";
import VanityHeader from "../shared/VanityHeader";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Search",

  data() {
    return {
      fssTab: false,
    };
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
    hasSDSAccess() {
      return this.currentUser.sds_access;
    },
  },
  methods: {
    ...mapActions("search", ["search"]),
  },

  components: {
    VanityHeader,
    Pills,
    ResultsWithNav,
    CompartmentedSection,
  },

  mounted() {
    this.$bus.$on("onTab", (index) => {
      this.fssTab = index != 0;
    });
    if (this.$route.query?.sensitive) {
      this.fssTab = this.$route.query.sensitive == "true";
    }
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
::v-deep .invalid-feedback {
  text-align: right;
}
</style>
