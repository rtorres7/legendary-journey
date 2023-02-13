import { getSitreps } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    loading: true,
    sitreps: [],
  },

  actions: {
    getSitrepFeeds: ({ state, commit }) => {
      state.loading = true;
      if (process.env.NODE_ENV === "low") {
        console.log("[store] getSitrepFeeds: ", getSitreps);
        setTimeout(() => commit("importSitrepData", getSitreps), 750);
      } else {
        axios.get("/articles").then((response) => {
          console.log("[store] getSitrepFeeds: ", response.data?.woah?.briefs);
          commit("importSitrepData", response.data?.woah?.briefs);
        });
      }
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value);
    },
  },

  mutations: {
    importSitrepData(state, data) {
      state.sitreps = data.map((article) => {
        return article.attributes;
      });
      state.loading = false;
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
