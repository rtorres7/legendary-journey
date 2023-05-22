import { productDetails } from "@/data";
import axios from "@/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    document: {},
    loading: true,
  },
  actions: {
    getProductDetails({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (import.meta.env.MODE === "offline") {
        let displayedDocument = productDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        console.log("[store] getProductDetails: ", displayedDocument.data);
        setTimeout(() => commit("saveDocument", displayedDocument.data), 750);
      } else {
        const url =
          route.name === "product-preview"
            ? `/documents/${route.params.doc_num}/preview.json`
            : `/preload/documents/${route.params.doc_num}.json`;
        axios.get(url).then((response) => {
          console.log("[store] getProductDetails: ", response.data);
          commit("saveDocument", response.data);
        });
      }
    },
    savePrintCount({ commit }) {
      let route = router.currentRoute.value;
      if (import.meta.env.MODE === "offline") {
        let displayedDocument = productDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        displayedDocument.data.print_count++;
        let count = displayedDocument.data.print_count;
        commit("updatePrintCount", count);
      } else {
        axios
          .post(`/documents/${route.params.doc_num}/record_print.js`)
          .then((response) => {
            console.log("[store] savePrintCount: ", response.data);
            commit("updatePrintCount", response.data.count);
          });
      }
    },
    saveEmailCount({ commit }) {
      let route = router.currentRoute.value;
      if (import.meta.env.MODE === "offline") {
        let displayedDocument = productDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        displayedDocument.data.email_count++;
        let count = displayedDocument.data.email_count;
        commit("updateEmailCount", count);
      } else {
        axios
          .post(`/documents/${route.params.doc_num}/record_email.js`)
          .then((response) => {
            console.log("[store] saveEmailCount: ", response.data);
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
    updatePrintCount(state, pc) {
      state.document["print_count"] = pc;
    },
    updateEmailCount(state, ec) {
      state.document["email_count"] = ec;
    },
  },
};
