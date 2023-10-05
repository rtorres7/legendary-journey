import { products } from "@/shared/data";
import { facetAggregations } from "@workspace/data";
import axios from "@/shared/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    saved: {
      loading: true,
      items: [],
      total: 0,
      facets: [],
    },
  },
  actions: {
    loadSavedProducts({ state, commit }) {
      state.saved.loading = true;
      if (import.meta.env.MODE === "offline") {
        const saved = products.published.map((product) => {
          return {
            ...product.attributes,
            saved: true,
          };
        });
        console.log("[store] loadSavedProducts: ", {
          content: saved,
          totalElements: saved.length,
          supplementaryData: {
            aggregations: facetAggregations,
          },
        });
        setTimeout(() => {
          commit("saveSavedProducts", {
            content: saved,
            totalElements: saved.length,
            supplementaryData: {
              aggregations: facetAggregations,
            },
          });
        }, 1000);
      } else {
        const { fullPath } = router.currentRoute.value;
        axios.get(fullPath, { params: { perPage: 20 } }).then((response) => {
          console.log("[store] loadSavedProducts: ", response.data);
          commit("saveSavedProducts", response.data);
        });
      }
    },
    //Test Console only
    setSavedLoading({ commit }, value) {
      commit("toggleSavedLoading", value);
    },
    setDraftsLoading({ commit }, value) {
      commit("toggleDraftsLoading", value);
    },
  },
  mutations: {
    saveSavedProducts(state, data) {
      state.saved.items = data.content;
      state.saved.total = data.totalElements;
      state.saved.facets = data.supplementaryData.aggregations;
      state.saved.loading = false;
    },
    //Test Console only
    toggleSavedLoading(state, value) {
      state.saved.loading = value;
    },
  },
};
