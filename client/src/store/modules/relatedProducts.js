import { relatedProducts } from "@/data";
import axios from "@/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    relatedDocuments: [],
    loading: true,
  },

  actions: {
    getRelatedDocuments({ state, commit }, wantsPreview) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (!wantsPreview && route.name !== "product-preview") {
        if (import.meta.env.MODE === "low") {
          let relatedDocuments = relatedProducts.filter(
            (relatedProduct) =>
              relatedProduct.document.doc_num === route.params.doc_num
          );
          console.log("[store] getRelatedDocuments: ", relatedDocuments);
          setTimeout(
            () => commit("saveRelatedDocuments", relatedDocuments),
            750
          );
        } else {
          axios
            .get(
              "/documents/" + `${route.params.doc_num}/related_documents.json`
            )
            .then((response) => {
              console.log("[store] getRelatedDocuments: ", response.data);
              commit("saveRelatedDocuments", response.data.relatedDocuments);
            });
        }
      } else {
        console.log("No Related Documents call for preview or draft");
      }
    },
  },

  mutations: {
    saveRelatedDocuments(state, relatedDocuments) {
      state.relatedDocuments = relatedDocuments;
      state.loading = false;
    },
  },
};
