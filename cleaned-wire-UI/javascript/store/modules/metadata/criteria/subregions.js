import baseMetadataStore from "./metadataHelper";

export default {
  state: {
    values: [],
  },
  ...baseMetadataStore,

  getters: {
    ...baseMetadataStore.getters,

    getCountries: (state) => (subregionCode) => {
      let countries = [];
    },

    getSubregionForCountry: (state) => (countryCode) => {
      return _.find(state.values, function (subregion) {
        if (subregion.country_codes.includes(countryCode)) {
          return subregion;
        }
      });
    },
  },
};
