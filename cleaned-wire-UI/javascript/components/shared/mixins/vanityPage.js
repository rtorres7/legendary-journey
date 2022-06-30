import codeConverter from "./codeConverter";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import _ from "lodash";

export default {
  mixins: [codeConverter],
  computed: {
    ...mapState("search", ["showFilters"]),
    ...mapGetters("metadata/criteria/subregions", {
      getSubregionForName: "getValueForName",
    }),
  },
  methods: {
    ...mapMutations("search", ["setShowFilters"]),

    criteriaName() {
      var criteriaName = "";
      var name = "";
      if (this.$route.name === "regions") {
        criteriaName = "regions";
        name = this.getCodeFromName(this.$route.params.regionName);
      } else if (this.$route.name === "subregions") {
        criteriaName = "subregions";
        name = this.getCodeFromName(this.$route.params.subregionName);
      } else if (this.$route.name === "countries") {
        criteriaName = "countries";
        name = this.getCountryCodeFromName(this.$route.params.countryName);
      } else if (this.$route.name === "issues") {
        criteriaName = "issues";
        name = this.getCodeFromName(this.$route.params.issueName);
      }
      criteriaName += "[]";

      return { name, criteriaName };
    },

    updateCriteria() {
      this.$router.replace({
        name: this.$route.name,
        params: this.$route.params,
        query: this.query,
      });
    },

    setup() {
      if (!this.$route.query[this.vanityParam]) {
        this.updateCriteria();
      }
      this.$store.dispatch("search/search", this.$route);
      this.setShowFilters(true);
    },
  },

  mounted() {
    if (!this.loading) {
      this.setup();
    }
    if (!this.$route.query?.view) {
      let query = Object.assign({}, this.$route.query);
      query["view"] = "grid";
      this.$router.push({ query });
    }
    this.$bus.$on("clear-search", () => {
      this.$router.push({
        name: this.$route.name,
        query: { clearSearch: true },
        params: this.$route.params,
      });
      this.setup();
    });
  },

  destroyed() {
    this.$bus.$off("clear-search");
  },

  watch: {
    loading() {
      if (this.loading === false) {
        this.setup();
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    if (
      _.isEqual(from.params, to.params) &&
      to.query.clearSearch === undefined
    ) {
      // visiting the page from itself, likely updating search criteria on the page. Do nothing
      next();
      this.$store.dispatch("search/search", this.$route);
    } else {
      // navigating from one vanity to another, such as regions/africa to regions/america, need to update criteria
      next();
      this.updateCriteria();
      this.$bus.$emit("vanity-page-update");
      this.$store.dispatch("search/search", this.$route);
    }
  },
};
