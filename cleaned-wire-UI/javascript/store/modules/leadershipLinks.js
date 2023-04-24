import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    leadershipLinks: [],
  },

  actions: {
    loadLeadershipLinks({ state, commit }) {
      state.loading = true;
      axios.get("/leadership_links").then((response) => {
        commit("importLeadershipLinks", response.data);
      });
    },
  },

  mutations: {
    importLeadershipLinks(state, data) {
      state.leadershipLinks = data;
      state.loading = false;
    },
  },
};
