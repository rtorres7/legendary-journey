export default {
  namespaced: true,
  state: {
    admin: false,
    blurredImages: false,
  },

  actions: {
    setBlurredImages({ commit }, value) {
      commit("toggleBlurredImages", value)
    },
    setAdmin({ commit }, value) {
      commit("toggleAdmin", value)
    },
  },

  mutations: {
    toggleBlurredImages(state, value) {
      state.blurredImages = value
    },
    toggleAdmin(state, value) {
      state.admin = value
    },
  },
};
