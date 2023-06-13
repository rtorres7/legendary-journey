import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    fssDocs: [],
  },

  getters: {
    fssDocs: (state) => {
      return state.fssDocs;
    },
    featuresLoading: (state) => {
      return state.loading;
    },
  },

  actions: {
    featureProduct({ commit }, { featureDate, docNum, caller }) {
      commit("setLoading", true);

      return axios({
        method: "POST",
        _temp_1: `/wires/${featureDate}/features`,
        data: { doc_num: docNum },
      })
        .then(() => {
          commit("setLoading", false);
        })
        .catch((e) => {
          commit("setLoading", false);
          caller.$wireNotification({
            type: "error",
            title: "Error",
            text: `Failed to feature product for ${featureDate}.`,
          });
        });
    },

    unfeatureProduct({ commit }, { featureDate, featureId, caller }) {
      commit("setLoading", true);

      return axios({
        method: "delete",
        _temp_1: `/wires/${featureDate}/features/${featureId}.js`,
      })
        .then((response) => {
          commit("setLoading", false);
          caller.$wireNotification({
            type: "success",
            title: "Product Feature Removed",
            text: `This product has been unfeatured for ${featureDate}.`,
          });
        })
        .catch((e) => {
          commit("setLoading", false);
          caller.$wireNotification({
            type: "error",
            title: "Error",
            text: `Failed to unfeatured product for ${featureDate}.`,
          });
        });
    },

    retrieveFeaturedFssProducts({ commit }, { caller }) {
      commit("setLoading", true);
      return axios
        .get(`/fss/sensitive_features`)
        .then((response) => {
          commit(
            "setFssDocs",
            response.data.results ? response.data.results.items : []
          );
          commit("setLoading", false);
        })
        .catch((e) => {
          commit("setLoading", false);
          caller.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to load WIRe sensitive products.",
          });
        });
    },

    saveFeaturedProductsSortOrder(
      { commit },
      { featureDate, features, caller }
    ) {
      let formData = new FormData();

      features.forEach((feature) =>
        formData.append("wire_product[]", feature.id)
      );

      return axios
        .patch(`/wires/${featureDate}/sort`, formData)
        .then((response) => {
          // returns no data in response (204 status code)
        })
        .catch((e) => {
          caller.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to update products for this wire book.",
          });
          // most likely session has timed out, reload to refresh tokens
          setTimeout(() => {
            document.location.reload();
          }, 5000);
        });
    },
  },

  mutations: {
    setFssDocs(state, fssDocs) {
      state.fssDocs = fssDocs;
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
  },
};
