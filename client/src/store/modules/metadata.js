import { metadata } from '@/data'
import axios from '@/config/wireAxios'

export default {
  namespaced: true,
  state: {
    loading: true,
    agency: "",
    contactEmail: "",
    criteria: {
      classification: [],
      countries: [],
      domestic_regions: [],
      fisa_role: [],
      issues: [],
      media_tags: [],
      non_state_actors: [],
      product_types: [],
      regions: [],
      reporting_types: [],
      selected_for: [],
      subregions: [],
      topics: []
    },
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
        console.log('[store] loadMetadata: ', metadata)
        setTimeout(() => commit("importMetadata", metadata), 750)
      } else {
        axios.get("/metadata").then((response) => {
          console.log('[store] loadMetadata: ', response.data.metadata)
          commit("importMetadata", response.data.metadata);
        });
      }
    },
    removeMetadata({ commit }) {
      commit("resetMetadata");
    }
  },

  mutations: {
    importMetadata(state, metadata) {
      state.loading = false
      state.agency = metadata.agency
      state.contactEmail = metadata.contactEmail
      state.criteria = {
        classification: metadata.criteria.classification.values,
        countries: metadata.criteria.countries.values,
        domestic_regions: metadata.criteria.domestic_regions.values,
        fisa_role: metadata.criteria.fisa_role.values,
        issues: metadata.criteria.issues.values,
        media_tags: metadata.criteria.media_tags.values,
        non_state_actors: metadata.criteria.non_state_actors.values,
        product_types: metadata.criteria.product_types.values,
        regions: metadata.criteria.regions.values,
        reporting_types: metadata.criteria.reporting_types.values,
        selected_for: metadata.criteria.selected_for.values,
        subregions: metadata.criteria.subregions.values,
        topics: metadata.criteria.topics.values
      }
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
    resetMetadata(state) {
      state.loading = true;
      state.criteria = {
        classification: [],
        countries: [],
        domestic_regions: [],
        fisa_role: [],
        issues: [],
        media_tags: [],
        non_state_actors: [],
        product_types: [],
        regions: [],
        reporting_types: [],
        selected_for: [],
        subregions: [],
        topics: []
      }
    }
  },
};
