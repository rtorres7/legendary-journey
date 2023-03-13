export default {
  namespaced: true,
  state: {
    currentTheme: "",
    loading: true,
  },
  actions: {
    getTheme({ state, commit }) {
      state.loading = true;
      let theme = localStorage.getItem("theme");
      commit("importData", theme);
      console.log(theme);
    },
    saveTheme({ state, commit }, selectedTheme) {
      state.loading = true;
      commit("importData", selectedTheme);
    },
  },

  mutations: {
    importData(state, theme) {
      state.currentTheme = theme;
      state.loading = false;
    },
  },
};
