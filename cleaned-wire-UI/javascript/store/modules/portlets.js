import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    portlets: {},
  },

  actions: {
    loadPortlets({ state, commit }) {
      state.loading = true;
      axios.get("/my_wire/portlets").then((response) => {
        commit("importPortlets", response.data);
      });
    },
  },

  mutations: {
    importPortlets(state, data) {
      state.portlets = data;
      state.loading = false;
    },
  },
};
