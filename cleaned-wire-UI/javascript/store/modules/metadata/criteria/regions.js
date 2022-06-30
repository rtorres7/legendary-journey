import baseMetadataStore from "./metadataHelper";

export default {
  state: {
    values: [],
  },
  ...baseMetadataStore,

  getters: {
    ...baseMetadataStore.getters,
    getSubregions: (state) => (regionCode) => {
      let subregions = [];
      return _.find(state.values, function (region) {
        return region.code === regionCode;
      }).subregions.forEach((subregion) => {
        console.log("subregion", subregion);
      });
    },

    getRegionForSubregion: (state) => (subregionCode) => {
      return _.find(state.values, function (region) {
        if (region.subregions.includes(subregionCode)) {
          return region;
        }
      });
    },
  },
};
