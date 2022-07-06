import { articles } from "@/data";

export default {
  namespaced: true,
  state: {
    featured: [],
    more: null,
    headlineStack: [],
    headlineTitle: "",
    readersChoice: [],
    highlights: {},
    highlights_header: "",
    highlights_subtext: "",
    additionalContent: {},
    specialEditions: [],
    loading: true,
    secondaryLoading: true,
    preload: {},
    imagesLoaded: 0,
    daily_wire: [],
    siteEnhancement: [],
  },

  actions: {
    getHomeArticles({ commit }) {
      commit("saveArticles", articles);
    },
    removeHomeArticles({ commit }) {
      commit("resetHomePage");
    }
  },

  mutations: {
    saveArticles(state, articles) {
      state.featured = articles;
      state.loading = false;
    },

    resetHomePage(state) {
      state.loading = true;
      state.featured = [];
      state.more = [];
    },
  },
};
