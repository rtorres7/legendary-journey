import { features, getSitreps } from "@/current/data";
import axios from "@/shared/config/wireAxios";

export default {
  namespaced: true,
  state: {
    articles: [],
    briefs: [],
    loading: true,
  },
  actions: {
    loadFeatures({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadFeatures: ", features, getSitreps);
        setTimeout(() => {
          commit("saveArticles", features);
          commit("saveBriefs", getSitreps);
          commit("toggleLoading", false);
        }, 750);
      } else {
        axios.get("/home/features").then((response) => {
          console.log("[store] loadFeatures: ", response);
          const data = response.data;
          commit("saveArticles", data.featured);
          commit("saveBriefs", data.briefs);
          commit("toggleLoading", false);
        });
      }
    },
    //Test Console Feature Only
    setArticles({ commit }, count) {
      commit("saveArticles", count <= 0 ? [] : features.slice(0, count));
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },
  mutations: {
    saveArticles(state, articles) {
      state.articles = articles;
    },
    saveBriefs(state, briefs) {
      state.briefs = briefs.map((article) => {
        return article.attributes;
      });
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
