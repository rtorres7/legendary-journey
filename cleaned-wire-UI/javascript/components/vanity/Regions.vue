<template>
  <div>
    <VanityHeader
      :title="$route.params.regionName"
      class="standard-page-margin"
    >
    </VanityHeader>
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import ResultsWithNav from "../search/ResultsWithNav";
import vanityPage from "@shared/mixins/vanityPage";
import Pills from "../search/pills/Pills";
import VanityHeader from "../shared/VanityHeader";

export default {
  name: "Regions",
  components: { VanityHeader, Pills, ResultsWithNav },
  mixins: [vanityPage],
  computed: {
    ...mapState("search", ["compact", "pages", "showFilters", "showContext"]),
    ...mapState("metadata/criteria", ["loading"]),
    ...mapState("metadata/criteria/regions", { regions: "values" }),
    ...mapState("metadata/criteria/countries", { storeCountries: "values" }),

    region() {
      for (const r in this.regions) {
        if (
          this.regions[r] &&
          this.regions[r].name === this.$route.params.regionName
        ) {
          return this.regions[r];
        }
      }
    },

    query() {
      return {
        "regions[]": this.getRegionCodeFromName(this.$route.params.regionName),
        "reporting_types[]": "analysis.all_source",
        view: "grid",
      };
    },

    countries() {
      var countries = [];
      if (!this.loading) {
        for (const s in this.region.subregions) {
          const subregion = this.region.subregions[s];
          for (const_temp_19in subregion.country_codes) {
            var country = this.storeCountries[subregion.country_codes[C]];
            country["code"] = subregion.country_codes[C];
            countries.push(country);
          }
        }
      }
      countries = _.orderBy(countries, ["name"], ["asc"]);
      return countries;
    },
  },

  methods: {
    ...mapGetters("countries", ["getCountryFromCode"]),

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
