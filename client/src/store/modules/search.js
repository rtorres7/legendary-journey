import { getOseFeeds, getSearchDataFromUrl } from "@/data"
import axios from "@/config/wireAxios"
import router from "@/router"

export default {
  namespaced: true,
  state: {
    loading: true,
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
    search: ({ state, dispatch }) => {
      state.loading = true;
      const route = router.currentRoute.value
      let url = route ? route.fullPath : "";
      if (route.query) {
        dispatch("standardSearch", url);
      }
    },

    getOseFeeds: ({ state, commit }) => {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        commit("importData", getOseFeeds)
        state.loading = false;
      } else {
        const params = { "view": "list", "producing_offices[]": "Directorate of Digital Innovation/Open Source Enterprise" }
        axios.get("/search", { params }).then(response => {
          console.log("response: ", response)
          commit("importData", response.data)
          state.loading = false;
        })
      }

    },

    standardSearch({ dispatch }, url) {
      if (url && url !== "/search") {
        url = "/search?" + url.split("?")[1];
      } else {
        url = "/search";
      }
      dispatch("debouncedSearch", url);
    },

    debouncedSearch: ({ commit, state }, url) => {
      commit("importData", getSearchDataFromUrl(url, router.currentRoute.value))
      state.loading = false;
    },

    removeSearch({ commit }) {
      commit("resetSearch");
    }
  },

  mutations: {
    importData(state, data) {
      console.log('search data: ', data);
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
    resetSearch(state) {
      state.searchId = null
      state.results = []
      state.aggregations = []
      state.pages = 1
      state.totalCount = null
      state.siteEnhancement = []
      state.daClassifError = false
      state.loading = true
    }
  },
};
