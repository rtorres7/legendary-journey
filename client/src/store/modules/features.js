import { features, getSitreps } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    products: [],
    briefs: [],
    loading: true,
  },
  actions: {
    loadFeatures({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadFeatures: ", features, getSitreps);
        setTimeout(() => {
          commit("saveProducts", features);
          commit("saveBriefs", getSitreps);
          commit("toggleLoading", false);
        }, 750);
      } else {
        axios.get("/home/features").then((response) => {
          console.log("[store] loadFeatures: ", response);
          const data = response.data;
          commit("saveProducts", data.featured);
          commit("saveBriefs", data.briefs);
          commit("toggleLoading", false);
        });
      }
    },
    //Test Console Feature Only
    setProducts({ commit }, count) {
      commit("saveProducts", count <= 0 ? [] : features.slice(0, count));
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },
  mutations: {
    saveProducts(state, products) {
      state.products = products;
    },
    saveBriefs(state, briefs) {
      state.briefs = briefs.map((product) => {
        return product.attributes;
      });
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
