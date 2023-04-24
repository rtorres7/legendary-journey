export default {
  namespaced: true,
  state: {
    expanded: true,
  },

  mutations: {
    hideHeader(state) {
      state.expanded = false;
    },

    showHeader(state) {
      state.expanded = true;
    },
  },
};
