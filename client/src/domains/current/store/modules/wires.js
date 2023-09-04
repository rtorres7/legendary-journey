import { products } from "@/shared/data";
import axios from "@/shared/config/wireAxios";

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
        const productsForBook = [...products.draft, ...products.published];
        console.log("[store] getWireByDate: ", productsForBook);
        setTimeout(() => commit("saveArticles", productsForBook), 750);
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
