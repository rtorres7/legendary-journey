import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    conceptsLinks: [],
  },

  actions: {
    loadConceptsLinks({ state, commit }) {
      state.loading = true;
      axios.get("/special_editions/links").then((response) => {
        commit("importConceptsLinks", response.data);
      });
    },
  },

  mutations: {
    importConceptsLinks(state, data) {
      state.conceptsLinks = data.concepts;
      state.loading = false;
    },
  },
};
