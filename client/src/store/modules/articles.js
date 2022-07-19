import { articles } from "@/data";
import { delay } from '@/helpers'

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
    getHomeArticles({ state, commit, rootState }) {
      console.log('how many times is this running')
      if (rootState.delay) {
        state.loading = true;
        delay(() =>
          commit("saveArticles", articles))
      } else {
        commit("saveArticles", articles)
      }
      // rootState.delay ?
      //   delay(() =>
      //     commit("saveArticles", articles)) : commit("saveArticles", articles)
    },
    removeHomeArticles({ commit }) {
      commit("resetHomePage");
    },
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
