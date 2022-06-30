import axios from "axios";
import { debounce, isEqual } from "lodash";
import { leadershipSearchHash } from "../../components/shared/mixins/codeConverter.js";

const landingPageMappings = {
  search: {},
  regions: {
    "reporting_types[]": "analysis.all_source",
  },
  subregions: {
    "reporting_types[]": "analysis.all_source",
  },
  countries: {
    "reporting_types[]": "analysis.all_source",
  },
  issues: {
    "reporting_types[]": "analysis.all_source",
  },
};

const nameMappings = {
  regions: "regionName",
  subregions: "subregionName",
  countries: "countryName",
  issues: "issueName",
  leadership: "profileType",
};

const getDynamicMapping = (rootState) => {
  let metadataName = rootState.route.name;
  let valueName = rootState.route.params[nameMappings[metadataName]];
  let mapping = landingPageMappings[metadataName];
  let values = rootState.metadata.criteria[metadataName]?.values;
  let value = values.find((metadata) => {
    if (metadata.name === valueName) {
      return metadata;
    }
  }).code;
  mapping[`${metadataName}[]`] = value;
  return mapping;
};

export default {
  namespaced: true,
  state: {
    loading: false,
    results: [],
    compact: true,
    advancedFilters: null,
    previousSearch: "",
    previousSearchQuery: {},
    showFilters: true,
    searchId: null,
    selecting: false,
    aggregations: [],
    pages: 1,
    totalCount: null,
    showContext: true,
    siteEnhancement: [],
    daClassifError: false,
  },

  actions: {
    search: debounce(({ state, commit, dispatch, rootState }) => {
      let url = rootState.route ? rootState.route.fullPath : "";
      let currentQuery = Object.assign({}, rootState.route.query);
      let mappedQuery;
      if (rootState.route.name === "search") {
        mappedQuery = Object.assign(
          {},
          landingPageMappings[rootState.route.name]
        );
      } else if (rootState.route.name === "leadership") {
        mappedQuery = Object.assign(
          {},
          leadershipSearchHash[rootState.route.params.profileType]
        );
      } else {
        mappedQuery = getDynamicMapping(rootState);
      }
      delete mappedQuery.view;
      delete currentQuery.view;
      if (isEqual(currentQuery, mappedQuery)) {
        url += "&landing=true";
      }

      if (state.searchId) {
        let oldQuery = Object.assign({}, state.previousSearchQuery);
        delete oldQuery.page;
        delete oldQuery.view;
        let newQuery = Object.assign({}, rootState.route.query);
        delete newQuery.page;
        delete newQuery.view;
        if (isEqual(newQuery, oldQuery)) {
          url += `&id=${state.searchId}`;
        }
      }
      if (rootState.route.query && rootState.route.query.visuals) {
        commit("clearSearch");
        dispatch("multimediaSearch", url);
      } else {
        if (rootState.route.query?.view === "visuals") {
          commit("clearSearch");
          dispatch("multimediaSearch", url);
        } else {
          dispatch("standardSearch", url);
        }
      }
    }, 250),

    standardSearch({ state, commit, dispatch, rootState }, url) {
      commit("savePreviousSearch", rootState.route);
      if (url && url !== "/search") {
        url = "/search?" + url.split("?")[1];
      } else {
        url = "/search";
      }
      if (state.previousSearch.replace("_temp_369=true&", "") !== url) {
        commit("clearSearch");
        dispatch("debouncedSearch", url);
      }
    },

    debouncedSearch: debounce(({ state, commit }, url) => {
      state.loading = true;
      axios.get(url).then((response) => {
        commit("importData", response.data);
        state.loading = false;
      });
      state.previousSearch = url.replace("_temp_369=true&", "");
    }, 300),

    multimediaSearch: debounce(({ state, commit }, url) => {
      state.loading = true;
      url = "/visuals?" + url.split("?")[1];
      axios.get(url).then((response) => {
        commit("importMultimedia", response.data);
        state.loading = false;
      });
    }, 300),
  },

  getters: {
    rssLink(state) {
      return state.previousSearch.replace("search", "search.rss");
    },
  },

  mutations: {
    savePreviousSearch(state, route) {
      state.previousSearchQuery = route.query;
    },

    importData(state, data) {
      state.searchId = data.searchId;
      state.results = data.results.map((article) => {
        return article;
      });
      state.aggregations = data.aggregations;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.siteEnhancement = data.siteEnhancement;
      state.daClassifError = data.daClassifError;
    },

    importMultimedia(state, data) {
      state.results = data.articles;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.daClassifError = data.daClassifError;
    },

    removeItemFromSiteEnhancements(state, doc_num) {
      state.siteEnhancement = [];
    },

    setShowContext(state, value) {
      state.showContext = value;
    },

    setCompact(state, compact) {
      state.compact = compact;
    },

    setFilterView(state, value) {
      state.advancedFilters = value;
    },

    setSelecting(state, value) {
      state.selecting = value;
    },

    setShowFilters(state, value) {
      state.showFilters = value;
    },

    setSearchId(state, value) {
      state.searchId = value;
    },

    clearSearchId(state) {
      state.searchId = null;
    },

    setPage(state, value) {
      state.page = value;
    },

    clearSearch(state) {
      state.results = [];
    },
  },
};
