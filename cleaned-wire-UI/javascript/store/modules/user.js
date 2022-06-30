import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    pretend: null,
    user: {},
  },

  getters: {
    user: (state) => {
      return state.user;
    },
    loading: (state) => {
      return state.loading;
    },
    hasRole: (state) => (roleName) => {
      if (state.user.roles) {
        return state.user.roles.includes(roleName);
      }
      return false;
    },
    canUseMetrics: (state, getters) => {
      return getters.hasRole("metrics_user");
    },
  },

  actions: {
    loadUser({ state, commit }) {
      state.loading = true;
      axios.get("/my_wire/user_data").then((response) => {
        commit("importUser", response.data);
      });
    },

    pretendUser({ state, commit }, pretendAs) {
      axios
        .put("/my_wire/preferences/pretends", {
          pretend_as: pretendAs,
        })
        .then(() => {
          commit("importPretend", pretendAs);
        });
    },

    pretendStatus({ state, commit }) {
      axios.get("/my_wire/preferences/pretends").then((response) => {
        commit("importPretend", response.data.pretend);
      });
    },
  },

  mutations: {
    importUser(state, data) {
      (state.user = data), (state.loading = false);
    },

    updateRevisionsSubscription(state) {
      state.user.revisions_subscriber = !state.user.revisions_subscriber;
    },

    updateSubscription(state) {
      state.user.wire_subscriber = !state.user.wire_subscriber;
    },

    importPretend(state, pretendAs) {
      state.pretend = pretendAs === "normal" ? null : pretendAs;
    },
  },
};
