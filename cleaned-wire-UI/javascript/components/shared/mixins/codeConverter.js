import { mapState, mapGetters } from "vuex";

export const leadershipSearchHash = {
  "Extremist Profiles": {
    "product_types[]": [],
    product_types_bool: "or",
    "reporting_types[]": "analysis.all_source",
    title: '"extremist profile"',
  },
  "Medical & Psychological Profiles": {
    "product_types[]": [],
    product_types_bool: "or",
    "tags[]": ["med-psych"],
    tags_bool: "and",
  },
};

export default {
  computed: {
    ...mapState("metadata/criteria/regions", { regions: "values" }),
    ...mapState("metadata/criteria/issues", { issues: "values" }),
    ...mapGetters("metadata/criteria/subregions", {
      getSubregionFromName: "getValueForName",
    }),

    vanityParam() {
      var preStr = this.$route.path.slice(1, this.$route.path.length);
      preStr = preStr.slice(0, preStr.indexOf("/"));
      return preStr + "[]";
    },
  },

  methods: {
    getCodeFromName(name = this.name) {
      if (this.$route.path.includes("subregions")) {
        return this.getSubregionCodeFromName(name);
      } else if (this.$route.path.includes("regions")) {
        return this.getRegionCodeFromName(name);
      } else if (this.$route.path.includes("issues")) {
        return this.getIssueCodeFromName(name);
      }
    },

    getRegionCodeFromName(name) {
      for (const r in this.regions) {
        if (name === this.regions[r].name) {
          return this.regions[r].code;
        }
      }
    },

    getSubregionCodeFromName(name) {
      return this.getSubregionFromName(name).code;
    },

    getCountryCodeFromName(name) {
      for (const index in this.countries) {
        const country = this.countries[index];
        if (country.name === name) {
          return this.countries[index].code;
        }
      }
    },

    getIssueCodeFromName(name) {
      for (const i in this.issues) {
        if (name === this.issues[i].name) {
          return this.issues[i].code;
        }
      }
    },

    getSearchHashForLeadership(profileType) {
      return leadershipSearchHash[profileType];
    },
  },
};
