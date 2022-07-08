//import axios from "axios";
import { useRoute } from "vue-router";
import { search } from "@/data";

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
    search: ({ dispatch }) => {
      const route = useRoute()
      console.log('inside search route:', route)
      let url = route ? route.fullPath : "";
      if (route.query) {
        dispatch("standardSearch", url);
      }
    },

    standardSearch({ dispatch }, url) {
      if (url && url !== "/search") {
        url = "/search?" + url.split("?")[1];
      } else {
        url = "/search";
      }
      console.log('url: ', url);
      dispatch("debouncedSearch", url);
    },

    debouncedSearch: ({ commit, state }, url) => {
      state.loading = true;
      console.log('debouncedSearch action url: ', url);
      switch (url) {
        case '/search?text=Ukraine&view=list': {
          commit("importData", search.ukraine)
          break
        }
        case '/search?text=United+Nations&view=list': {
          commit("importData", search.united_nations)
          break
        }
        default: {
          commit("importData", search.default)
        }

      }

    }
  },

  mutations: {

    importData(state, data) {
      console.log('data: ', data);
      state.searchId = data.searchId;
      state.results = data.results.map((article) => {
        return article;
      });
      state.aggregations = data.aggregations;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.siteEnhancement = data.siteEnhancement;
      state.daClassifError = data.daClassifError;
      console.log('state: ', state);
    },
  },
};
