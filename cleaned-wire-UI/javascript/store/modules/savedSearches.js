import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    savedSearches: [],
    editing: false,
  },

  actions: {
    loadSavedSearches({ state, commit }) {
      state.loading = true;
      axios.get("/my_wire/searches").then((response) => {
        commit("importSavedSearches", response.data);
      });
    },

    createSavedSearch({ state, dispatch }, props) {
      const query = props.query;
      const formData = props.formData;
      state.loading = true;
      let _temp_1 = "/search?";
      for (const q in query) {
        if (Array.isArray(query[q])) {
          _temp_1 = addToQueryFromArray(_temp_1, query[q], q);
        } else {
          _temp_1 += q + "=" + query[q] + "&";
        }
      }
      axios({
        method: "post",
        _temp_1: _temp_1,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        data: formData,
      }).then((response) => {
        dispatch("loadSavedSearches");
      });
    },
  },

  mutations: {
    importSavedSearches(state, data) {
      state.savedSearches = data;
      state.loading = false;
    },
  },
};
