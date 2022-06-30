import baseMetadataStore from "./metadataHelper";

export default {
  state: {
    values: [],
  },
  ...baseMetadataStore,

  getters: {
    ...baseMetadataStore.getters,

    getReportingAndProductTypes: (state) => () => {
      let types = [];
      state.values.forEach((productType) => {
        if (!types[productType.reporting_type]) {
          types[productType.reporting_type] = [];
        }
        types[productType.reporting_type].push(productType);
      });
      return types;
    },
  },
};
