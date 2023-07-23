import { alerts } from "@/current/data";
import axios from "@/shared/config/wireAxios";

export default {
  namespaced: true,
  state: {
    loading: true,
    alerts: [],
  },

  actions: {
    loadAlerts({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadAlerts: ", alerts);
        setTimeout(() => commit("importAlerts", alerts), 750);
      } else {
        axios.get("/alerts/list").then((response) => {
          console.log("[store] loadAlerts: ", response.data);
          commit("importAlerts", response.data);
        });
      }
    },
  },

  mutations: {
    importAlerts(state, data) {
      state.alerts = data.alerts;
      state.loading = false;
    },
  },
};
