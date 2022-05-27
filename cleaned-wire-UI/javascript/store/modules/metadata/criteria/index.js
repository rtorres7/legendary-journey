import classification from "./classification";
import countries from "./countries";
import domesticRegions from "./domesticRegions";
import fisaRole from "./fisaRole";
import issues from "./issues";
import mediaTags from "./mediaTags";
import nonStateActors from "./nonStateActors";
import producingOffices from "./producingOffices";
import productTypes from "./productTypes";
import regions from "./regions";
import reportingTypes from "./reportingTypes";
import selectedFor from "./selectedFor";
import subregions from "./subregions";
import topics from "./topics";

export default {
  namespaced: true,

  state: {
    loading: true,
  },

  modules: {
    classification,
    countries,
    domesticRegions,
    fisaRole,
    issues,
    mediaTags,
    nonStateActors,
    producingOffices,
    productTypes,
    regions,
    reportingTypes,
    selectedFor,
    subregions,
    topics,
  },

  actions: {
    import({ state, commit }, data) {
      commit("classification/import", data.criteria.classification);
      commit("countries/import", data.criteria.countries);
      commit("domesticRegions/import", data.criteria.domestic_regions);
      commit("fisaRole/import", data.criteria.fisa_role);
      commit("issues/import", data.criteria.issues);
      commit("mediaTags/import", data.criteria.media_tags);
      commit("nonStateActors/import", data.criteria.non_state_actors);
      commit("producingOffices/import", data.criteria.producing_offices);
      commit("productTypes/import", data.criteria.product_types);
      commit("regions/import", data.criteria.regions);
      commit("reportingTypes/import", data.criteria.reporting_types);
      commit("selectedFor/import", data.criteria.selected_for);
      commit("subregions/import", data.criteria.subregions);
      commit("topics/import", data.criteria.topics);
      state.loading = false;
    },
  },
};
