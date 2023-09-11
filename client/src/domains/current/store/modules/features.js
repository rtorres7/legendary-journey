import { products } from "@/shared/data";
import axios from "@/shared/config/wireAxios";

export default {
  namespaced: true,
  state: {
    features: [],
    briefs: [],
    loading: true,
  },
  actions: {
    loadFeaturedContent({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadFeaturedContent: ", {
          features: products.published,
          briefs: products.briefs,
        });
        setTimeout(() => {
          commit("saveFeatures", products.published);
          commit("saveBriefs", products.briefs);
          commit("toggleLoading", false);
        }, 750);
      } else {
        axios.get("/home/features").then((response) => {
          console.log("[store] loadFeaturedContent: ", response);
          commit("saveFeatures", response.data.featured);
          commit("saveBriefs", response.data.briefs);
          commit("toggleLoading", false);
        });
      }
    },
    //Test Console Feature Only
    setFeatureCount({ commit }, count) {
      commit(
        "saveFeatures",
        count <= 0 ? [] : products.published.slice(0, count)
      );
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },
  mutations: {
    saveFeatures(state, features) {
      state.features = features.map((product) => {
        return product.attributes;
      });
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
