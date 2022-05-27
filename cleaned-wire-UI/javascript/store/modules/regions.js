import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    regions: [],
  },

  actions: {
    loadRegions({ state, commit }) {
      state.loading = true;
      axios.get("/regions").then((response) => {
        commit("importRegions", response.data);
        commit("sendToMetaData");
      });
    },
  },

  getters: {
    subregionsAsOptions(state) {
      var subregions = {
        grouped: true,
        criteria: "subregions[]",
        items: [],
      };
      for (const ind in state.regions) {
        const region = state.regions[ind];
        var regionOption = {
          text: region.name,
          items: [],
        };
        for (const subInd in region.subregions) {
          const subregion = region.subregions[subInd];
          regionOption.items.push({
            code: subregion.code,
            text: subregion.name,
          });
        }
        subregions.items.push(regionOption);
      }
      return subregions;
    },

    regionsAsOptions(state) {
      var regions = {
        grouped: false,
        criteria: "regions[]",
        items: [],
      };

      for (const ind in state.regions) {
        const region = state.regions[ind];
        regions.items.push({
          text: region.name,
          code: region.code,
        });
      }
      return regions;
    },
  },

  mutations: {
    importRegions(state, data) {
      state.regions = data;
      state.loading = false;
    },

    sendToMetaData(state) {
      var regions = {};
      var subregions = {};
      for (const r in state.regions) {
        const region = state.regions[r];
        regions[region.code] = region.name;
        for (const s in region.subregions) {
          subregions[region.subregions[s].code] = region.subregions[s].name;
        }
      }
      this.commit("metadata/addMeta", { regions, subregions });
    },
  },
};
