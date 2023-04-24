import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    alerts: [],
  },

  actions: {
    loadAlerts({ state, commit }) {
      state.loading = true;
      axios.get("/alerts/list").then((response) => {
        commit("importAlerts", response.data);
      });
    },
  },

  mutations: {
    importAlerts(state, data) {
      state.alerts = data.alerts;
      state.loading = false;
    },
  },
};
