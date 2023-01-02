import { getNicFeeds } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    loading: true,
    sitreps: [],
    searchId: null,
    selecting: false,
    aggregations: [],
    pages: 1,
    totalCount: null,
    siteEnhancement: [],
    daClassifError: false,
  },

  actions: {
    getSitrepFeeds: ({ state, commit }) => {
      console.log("getSitrepFeeds triggered");
      state.loading = true;
      if (process.env.NODE_ENV === "low") {
        commit("importData", getNicFeeds);
        state.loading = false;
      } else {
        axios.get("/home/daniel").then((response) => {
          console.log("response: ", response);
          commit("importSitrepData", response.data?.woah?.briefs);
          state.loading = false;
        });
      }
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },

  mutations: {
    importSitrepData(state, data) {
      console.log("feed (search) data: ", data);
      state.searchId = data.searchId;
      state.sitreps = data.map((article) => {
        return article.attributes;
      });
      state.aggregations = data.aggregations;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.siteEnhancement = data.siteEnhancement;
      state.daClassifError = data.daClassifError;
    },
  },
};
