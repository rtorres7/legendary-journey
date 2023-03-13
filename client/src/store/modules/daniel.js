import { danielArticles } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    articles: [],
    loading: true,
  },
  actions: {
    getDanielArticles({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "low") {
        console.log("[store] getDanielArticles: ", danielArticles);
        setTimeout(() => commit("saveArticles", danielArticles), 750);
      } else {
        axios.get("/articles").then((response) => {
          console.log("[store] getDanielArticles: ", response);
          const data = response.data.woah;
          let articles = [];
          if (data) {
            if (data.featured) {
              articles = articles.concat(data.featured);
            }
            if (data.secondary) {
              articles = articles.concat(data.secondary);
            }
          }
          commit("saveArticles", articles);
        });
      }
    },
    //Test Console Feature Only
    setDanielArticles({ commit }, count) {
      commit("saveArticles", count <= 0 ? [] : danielArticles.slice(0, count));
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },
  mutations: {
    saveArticles(state, articles) {
      state.articles = articles;
      state.loading = false;
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
