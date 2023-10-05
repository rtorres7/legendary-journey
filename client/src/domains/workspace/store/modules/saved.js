import { products } from "@/shared/data";
import { facetAggregations } from "@workspace/data";
import axios from "@/shared/config/wireAxios";
import router from "@/router";

const savedProducts = products.published.map((product) => {
  return {
    ...product.attributes,
    saved: true,
  };
});

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
        const { query } = router.currentRoute.value;
        const page = query.page ? parseInt(query.page) : 1;
        const starting = page === 1 ? 0 : (page - 1) * 20;
        const pageMax = page * 20;
        const ending =
          savedProducts.length < pageMax ? savedProducts.length : pageMax;
        const paginatedProducts = savedProducts.slice(starting, ending);

        console.log("[store] loadSavedProducts: ", {
          content: paginatedProducts,
          totalElements: savedProducts.length,
          supplementaryData: {
            aggregations: facetAggregations,
          },
        });
        setTimeout(() => {
          commit("saveSavedProducts", {
            content: paginatedProducts,
            totalElements: savedProducts.length,
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
    setSavedCount({ commit }, count) {
      commit(
        "saveSavedProducts",
        count <= 0 ? [] : savedProducts.slice(0, count)
      );
    },
    setSavedLoading({ commit }, value) {
      commit("toggleSavedLoading", value);
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
