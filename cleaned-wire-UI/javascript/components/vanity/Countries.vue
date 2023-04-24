<template>
  <div>
    <VanityHeader
      v-if="!loading"
      :title="$route.params.countryName"
      :code="countryCode"
      class="standard-page-margin"
      :mapCodes="[countryCode]"
    >
      <div class="font-size-4 alt-800 mb-5">{{ subregion }}</div>
    </VanityHeader>
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import ResultsWithNav from "../search/ResultsWithNav";
import VanityHeader from "@shared/VanityHeader";
import vanityPage from "@shared/mixins/vanityPage";
import Pills from "../search/pills/Pills";

export default {
  name: "Countries",
  components: { Pills, ResultsWithNav, VanityHeader },
  mixins: [vanityPage],
  computed: {
    ...mapState("metadata/criteria/countries", { countries: "values" }),
    ...mapState("metadata/criteria", ["loading"]),
    ...mapState("search", ["showFilters"]),
    ...mapGetters("metadata/criteria/subregions", {
      getSubregionForName: "getValueForName",
      getSubregionForCountry: "getSubregionForCountry",
    }),

    query() {
      return {
        "countries[]": this.loading
          ? this.$route.query["countries[]"]
          : this.getCountryCodeFromName(this.$route.params.countryName),
        "reporting_types[]": "analysis.all_source",
        view: "grid",
      };
    },

    country() {
      if (this.loading) {
        return null;
      }
      for (const c in this.countries) {
        const country = this.countries[c];
        if (country.name === this.$route.params.countryName) {
          return country;
        }
      }
    },

    countryCode() {
      return this.country ? this.country.code : "";
    },

    subregion() {
      let subregion = this.getSubregionForCountry(this.countryCode);
      if (subregion) {
        return subregion.name;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.leader-profiles {
  border-left: solid 1px $alt-600;
}
</style>
