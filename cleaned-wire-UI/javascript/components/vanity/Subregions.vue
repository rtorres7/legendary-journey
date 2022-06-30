<template>
  <div>
    <VanityHeader
      :title="$route.params.subregionName"
      class="standard-page-margin"
    >
    </VanityHeader>
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import vanityPage from "@shared/mixins/vanityPage";
import VanityHeader from "@shared/VanityHeader";
import ResultsNav from "@shared/ResultsNav";
import ResultsWithNav from "../search/ResultsWithNav";
import Pills from "../search/pills/Pills";

export default {
  name: "Subregions",
  components: {
    ResultsWithNav,
    Pills,
    VanityHeader,
    ResultsNav,
  },
  mixins: [vanityPage],
  computed: {
    ...mapState("metadata/criteria", ["loading"]),
    ...mapGetters("metadata/criteria/regions", {
      getRegion: "getRegionForSubregion",
    }),
    ...mapGetters("metadata/criteria/countries", {
      getCountryFromCode: "getValueForCode",
    }),
    ...mapState("search", ["showFilters"]),
    ...mapGetters("metadata/criteria/subregions", ["getValueForName"]),

    query() {
      return {
        "subregions[]": this.subregion.code,
        "reporting_types[]": "analysis.all_source",
        view: "grid",
      };
    },

    subregion() {
      return this.getValueForName(this.$route.params.subregionName);
    },

    region() {
      return this.getRegion(this.subregion.code);
    },

    countries() {
      let countries = [];
      this.subregion.country_codes.forEach((code) => {
        countries.push(this.getCountryFromCode(code));
      });
      return countries;
    },
  },
  methods: {
    moreFilters() {
      var query = this.$route.query;
      query["regions[]"] = [this.region.code];
      this.$router.push({
        name: "advanced_search",
        query: query,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.title-block {
  position: relative;
}
</style>
