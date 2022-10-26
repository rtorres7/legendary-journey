import axios from "axios";

function notifyUser(caller, message, error) {
  caller.$wireNotification({
    group: "main",
    type: "error",
    title: `Error on ${message}`,
    text: `Error on ${message}, please try again. ${error.message}`,
  });
}

export default {
  namespaced: true,
  state: {
    loading: false,
    exports: [],
  },

  getters: {
    exports: (state) => {
      return state.exports;
    },
    loading: (state) => {
      return state.loading;
    },
  },

  actions: {
    loadExports({ state, commit }, caller) {
      state.loading = true;
      axios
        .get("/exports")
        .then((response) => {
          commit("setExports", response.data);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyUser(caller, "loading exports", error);
        });
    },
    deleteExport({ state, commit }, { exportId, caller }) {
      let self = this;
      axios
        .delete(`/exports/${exportId}`)
        .then((response) => {
          self.dispatch("exports/loadExports", caller);
        })
        .catch((error) => {
          state.loading = false;
          notifyUser(caller, "deleting export", error);
        });
    },
  },

  mutations: {
    setExports(state, data) {
      state.exports = data;
    },
  },
};
