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
      let url = "/search?";
      for (const q in query) {
        if (Array.isArray(query[q])) {
          url = addToQueryFromArray(url, query[q], q);
        } else {
          url += q + "=" + query[q] + "&";
        }
      }
      axios({
        method: "post",
        url: url,
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
