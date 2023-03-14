export default {
  namespaced: true,
  state: {
    currentTheme: "",
    loading: true,
  },
  actions: {
    saveTheme({ state, commit }, selectedTheme) {
      state.loading = true;
      commit("importData", selectedTheme);
    },
  },

  getters: {
    theme: (state) => {
      return state.currentTheme;
    },
  },

  mutations: {
    importData(state, theme) {
      state.currentTheme = theme;
      state.loading = false;
    },
  },
};
