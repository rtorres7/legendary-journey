import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    logo_name: "",
    alt: "",
  },

  actions: {
    loadLogoInfo({ state, commit }) {
      state.loading = true;
      axios.get("/logo").then((response) => {
        commit("setLogoInfo", response.data);
      });
    },
  },

  mutations: {
    setLogoInfo(state, data) {
      state.logo_name = data.logo;
      state.alt = data.alt;
      state.loading = false;
    },
  },
};
