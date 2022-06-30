import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    programOfAnalysisLinks: [],
  },

  actions: {
    loadProgramOfAnalysisLinks({ state, commit }) {
      state.loading = true;
      axios.get("/program_of_analysis_links").then((response) => {
        commit("importProgramOfAnalysisLinks", response.data);
      });
    },
  },

  mutations: {
    importProgramOfAnalysisLinks(state, data) {
      state.programOfAnalysisLinks = data;
      state.loading = false;
    },
  },
};
