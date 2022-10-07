import { metadata } from '@/data'
import axios from '@/config/wireAxios'

export default {
  namespaced: true,
  state: {
    loading: true,
    agency: "",
    contactEmail: "",
    criteria: {},
    featuresAvailable: {},
    highlightsBanner: "",
    highlightsNavHeader: "",
    name: "",
    nonProduction: false,
    project: "",
    resourceLinks: [],
    searchFilters: [],
    siteClassification: "",
    siteDefaultTitle: "",
  },

  actions: {
    loadMetadata({ commit }) {
      if (process.env.NODE_ENV === 'low') {
        commit("importMetadata", metadata);
      } else {
        axios.get("/metadata").then((response) => {
          commit("importMetadata", response.data.metadata);
        });
      }
    },
  },

  mutations: {
    importMetadata(state, metadata) {
      state.loading = false
      state.agency = metadata.agency
      state.contactEmail = metadata.contactEmail
      state.criteria = metadata.criteria
      state.featuresAvailable = metadata.features_available
      state.highlightsBanner = metadata.highlightsBanner
      state.highlightsNavHeader = metadata.highlightsNavHeader
      state.name = metadata.name
      state.nonProduction = metadata.nonProduction
      state.project = metadata.project
      state.resourceLinks = metadata.resourceLinks
      state.searchFilters = metadata.searchFilters
      state.siteClassification = metadata.siteClassification
      state.siteDefaultTitle = metadata.siteDefaultTitle
    },
  },
};
