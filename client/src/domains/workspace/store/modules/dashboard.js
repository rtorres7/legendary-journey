import { products } from "@/shared/data";
import axios from "@/shared/config/wireAxios";

export default {
  namespaced: true,
  state: {
    saved: {
      loading: true,
      items: [],
      total: 0,
    },
    drafts: {
      loading: true,
      items: [],
    },
    published: {
      loading: true,
      items: [],
      total: 0,
    },
    stats: {
      loading: true,
      value: {},
    },
  },
  actions: {
    loadSavedProducts({ state, commit }) {
      state.saved.loading = true;
      if (import.meta.env.MODE === "offline") {
        const saved = products.published.slice(0, 2).map((product) => {
          return {
            ...product.attributes,
            saved: true,
          };
        });
        console.log("[store] loadSavedProducts: ", {
          content: saved,
          totalElements: saved.length,
        });
        setTimeout(() => {
          commit("saveSavedProducts", {
            content: saved,
            totalElements: saved.length,
          });
        }, 1000);
      } else {
        axios
          .get("/workspace/saved", { params: { perPage: 4 } })
          .then((response) => {
            console.log("[store] loadSavedProducts: ", response.data);
            commit("saveSavedProducts", response.data);
          });
      }
    },
    loadDrafts({ state, commit }) {
      state.drafts.loading = true;
      if (import.meta.env.MODE === "offline") {
        const drafts = products.draft.map((product) => {
          return {
            ...product.attributes,
          };
        });
        console.log("[store] loadDrafts: ", drafts);
        setTimeout(() => {
          commit("saveDraftProducts", drafts);
        }, 1000);
      } else {
        axios.get("/workspace/drafts").then((response) => {
          console.log("[store] loadDrafts: ", response.data.content);
          commit("saveDraftProducts", response.data.content);
        });
      }
    },
    loadPublished({ state, commit }) {
      state.published.loading = true;
      if (import.meta.env.MODE === "offline") {
        const published = products.published.map((product) => {
          return {
            ...product.attributes,
          };
        });
        console.log("[store] loadPublished: ", {
          content: published,
          totalElements: published.length,
        });
        setTimeout(() => {
          commit("savePublishedProducts", {
            content: published,
            totalElements: published.length,
          });
        }, 1000);
      } else {
        axios
          .get("/workspace/recent", { params: { perPage: 4 } })
          .then((response) => {
            console.log("[store] loadPublished: ", response.data);
            commit("savePublishedProducts", response.data);
          });
      }
    },
    loadStats({ state, commit }) {
      state.stats.loading = true;
      if (import.meta.env.MODE === "offline") {
        const stats = { totalViews: "1.23k", totalCreated: 100 };
        console.log("[store] loadStats: ", stats);
        setTimeout(() => {
          commit("saveStats", stats);
        }, 1000);
      } else {
        axios.get("/workspace/stats").then((response) => {
          if (response.data && response.data.totalViews) {
            console.log("[store] loadStats: ", {
              totalViews: response.data.totalViews,
              totalCreated: response.data.totalCreated,
            });
            commit("saveStats", {
              totalViews: response.data.totalViews,
              totalCreated: response.data.totalCreated,
            });
          }
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
    setPublishedLoading({ commit }, value) {
      commit("togglePublishedLoading", value);
    },
    setStatsLoading({ commit }, value) {
      commit("toggleStatsLoading", value);
    },
  },
  mutations: {
    saveSavedProducts(state, data) {
      state.saved.items = data.content;
      state.saved.total = data.totalElements;
      state.saved.loading = false;
    },
    saveDraftProducts(state, products) {
      state.drafts.items = products;
      state.drafts.loading = false;
    },
    savePublishedProducts(state, data) {
      state.published.items = data.content;
      state.published.total = data.totalElements;
      state.published.loading = false;
    },
    saveStats(state, stats) {
      state.stats.value = stats;
      state.stats.loading = false;
    },
    //Test Console only
    toggleSavedLoading(state, value) {
      state.saved.loading = value;
    },
    toggleDraftsLoading(state, value) {
      state.drafts.loading = value;
    },
    togglePublishedLoading(state, value) {
      state.published.loading = value;
    },
    toggleStatsLoading(state, value) {
      state.stats.loading = value;
    },
  },
};
