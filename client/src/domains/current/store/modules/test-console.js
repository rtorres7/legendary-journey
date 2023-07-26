//Module for Test Console specific state
export default {
  namespaced: true,
  state: {
    admin: false,
    sampleImage: false,
    uploadBinary: null,
  },

  actions: {
    setSampleImage({ commit }, value) {
      commit("toggleSampleImage", value);
    },
    setAdmin({ commit }, value) {
      commit("toggleAdmin", value);
    },
    setUploadBinary({ commit }, value) {
      commit("saveUploadBinary", value);
    },
  },

  mutations: {
    toggleSampleImage(state, value) {
      state.sampleImage = value;
    },
    toggleAdmin(state, value) {
      state.admin = value;
    },
    saveUploadBinary(state, value) {
      state.uploadBinary = value;
    },
  },
};
