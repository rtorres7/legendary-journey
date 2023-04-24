export default {
  namespaced: true,
  state: {
    searchFilter: "",
  },

  mutations: {
    setSearchFilter(state, value) {
      state.searchFilter = value;
    },
  },
};
