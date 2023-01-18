import { danielArticlesDetails } from "@/data";
import axios from "@/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    document: {},
    loading: true,
  },

  actions: {
    getDanielArticlesDetails({ state, commit }, wantsPreview) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === "low") {
        let displayedDocument = danielArticlesDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        console.log(
          "[store] getDanielArticlesDetails: ",
          displayedDocument.data
        );
        setTimeout(() => commit("saveDocument", displayedDocument.data), 750);
      } else {
        const url =
          route.name === "product-preview" || wantsPreview
            ? `/documents/${route.params.doc_num}/preview.json`
            : `/preload/documents/${route.params.doc_num}.json`;
        axios.get(url).then((response) => {
          console.log("[store] getDanielArticlesDetails: ", response.data);
          commit("saveDocument", response.data);
        });
      }
    },
    saveEmailCount({ commit }) {
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === "low") {
        let displayedDocument = danielArticlesDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        displayedDocument.data.email_count++;
        let count = displayedDocument.data.email_count;
        commit("updateEmailCount", count);
      } else {
        axios
          .post(`/documents/${route.params.doc_num}/record_email.js`)
          .then((response) => {
            console.log("[store] getDanielArticlesDetails: ", response.data);
            commit("updateEmailCount", response.data.count);
          });
      }
    },
  },

  mutations: {
    saveDocument(state, document) {
      state.document = document;
      state.loading = false;
    },
    updateEmailCount(state, ec) {
      state.document["email_count"] = ec;
    },
  },
};
