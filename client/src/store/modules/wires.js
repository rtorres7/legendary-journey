import { articlesForWire } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    articles: [],
    loading: true,
  },
  actions: {
    getWireByDate({ state, commit }, date) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] getWireByDate: ", articlesForWire);
        setTimeout(() => commit("saveArticles", articlesForWire), 750);
      } else {
        axios.get("/wires/" + date + "/getWireByDate").then((response) => {
          console.log("[store] getWireByDate: ", response.data);
          commit("saveArticles", response?.data?.features);
        });
      }
    },
  },
  mutations: {
    saveArticles(state, articles) {
      state.articles = articles;
      state.loading = false;
    },
  },
};
