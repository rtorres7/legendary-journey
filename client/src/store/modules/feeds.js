import { getOseFeeds } from "@/data"
import { getKingFisherFeeds } from "@/data"
import { getNicFeeds } from "@/data"
import axios from "@/config/wireAxios"

export default {
  namespaced: true,
  state: {
    loading: true,
    results: [],
    kingFisher: [],
    nic: [],
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
    getOseFeeds: ({ state, commit }) => {
      console.log("getOseFeeds triggered")
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
    getKingFisherFeeds: ({ state, commit }) => {
      console.log("getKingFisherFeeds triggered")
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        commit("importKingFisherData", getKingFisherFeeds)
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
    getNicFeeds: ({ state, commit }) => {
      console.log("getNicFeeds triggered")
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        commit("importNicData", getNicFeeds)
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
    //Test Console Feature Only
    setFeeds({ commit }, count) {
      commit("saveFeeds", count <= 0 ? [] : getOseFeeds.results.slice(0, count))
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value)
    },
  },

  mutations: {
    importData(state, data) {
      console.log('feed (search) data: ', data);
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
    importKingFisherData(state, data) {
      console.log('feed (search) data: ', data);
      state.searchId = data.searchId;
      state.kingFisher = data.results.map((article) => {
        return article;
      });
      state.aggregations = data.aggregations;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.siteEnhancement = data.siteEnhancement;
      state.daClassifError = data.daClassifError;
    },
    importNicData(state, data) {
      console.log('feed (search) data: ', data);
      state.searchId = data.searchId;
      state.nic = data.results.map((article) => {
        return article;
      });
      state.aggregations = data.aggregations;
      state.pages = Math.ceil(data.pages);
      state.totalCount = data.totalCount;
      state.siteEnhancement = data.siteEnhancement;
      state.daClassifError = data.daClassifError;
    },
    saveFeeds(state, feeds) {
      state.results = feeds;
      state.loading = false;
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
