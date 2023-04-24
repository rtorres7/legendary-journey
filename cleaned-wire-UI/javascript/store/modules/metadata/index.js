import criteria from "./criteria";
import { assign } from "lodash";
import axios from "axios";

export default {
  namespaced: true,

  state: {
    agency: "",
    contactEmail: "",
    defaultExportFormat: "",
    exportFormatOptions: "",
    featuresAvailable: {},
    highlightsBanner: "",
    highlightsNavHeader: "",
    metadataLoading: true,
    name: "",
    nonProduction: false,
    project: "",
    resourceLinks: [],
    searchFilters: [],
    siteClassification: "",
    siteDefaultTitle: "",
  },

  modules: {
    criteria,
  },

  mutations: {
    import(state, data) {
      // This doesn't seem to be the best solution -- revisit where this should be set
      if (document.title == "") {
        document.title = data.siteDefaultTitle;
      }
      assign(state, {
        agency: data.agency,
        contactEmail: data.contactEmail,
        defaultExportFormat: data.defaultExportFormat,
        exportFormatOptions: data.exportFormatOptions,
        featuresAvailable: data.features_available,
        highlightsBanner: data.highlightsBanner,
        highlightsNavHeader: data.highlightsNavHeader,
        metadataLoading: false,
        name: data.name,
        nonProduction: data.nonProduction,
        project: data.project,
        resourceLinks: data.resourceLinks,
        searchFilters: data.searchFilters,
        siteClassification: data.siteClassification,
        siteDefaultTitle: data.siteDefaultTitle,
      });
    },
  },

  actions: {
    import({ state, commit, dispatch }) {
      state.metadataLoading = true;
      axios.get("/metadata").then((response) => {
        dispatch("criteria/import", response.data.metadata);
        commit("import", response.data.metadata);
      });
    },
  },
};
