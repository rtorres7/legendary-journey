import axios from "axios";

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
    search: ({ dispatch, rootState }) => {
      let url = rootState.route ? rootState.route.fullPath : "";
      if (rootState.route.query) {
        dispatch("standardSearch", url);
      }
    },

    standardSearch({ commit, dispatch, rootState }, url) {
      commit("savePreviousSearch", rootState.route);
      if (url && url !== "/search") {
        url = "/search?" + url.split("?")[1];
      } else {
        url = "/search";
      }
      dispatch("debouncedSearch", url);
    },

    debouncedSearch: ({ state, commit }, url) => {
      state.loading = true;
      axios.get(url).then((response) => {
        commit("importData", response.data);
        state.loading = false;
      });
    }
  },

  mutations: {

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
  },
};
