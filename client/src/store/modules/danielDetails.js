import { danielArticlesDetails } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"

export default {
  namespaced: true,
  state: {
    document: {},
    relatedDocs: {},
    loading: true,
  },

  actions: {
    getDanielArticlesDetails({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === 'low') {
        let displayedDocument = danielArticlesDetails.find(({ data }) => data.doc_num === route.params.doc_num);
        commit("saveDocument", displayedDocument.data);
      } else {
        const url = route.name === 'article-preview' ? `/documents/${route.params.doc_num}/preview.json` : `/preload/documents/${route.params.doc_num}.json`
        axios.get(url).then(response => {
          console.log('/preload/documents/ (response):', response);
          commit("saveDocument", response.data);
        })
      }
    },
    getDanielRelatedDocuments({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === 'low') {
        let relatedDocuments = danielArticlesDetails.find(({ data }) => data.doc_num === route.params.doc_num);
        commit("saveDocument", relatedDocuments.data);
      } else {
        axios.get("/documents/" + `${route.params.doc_num}/related_documents.json`).then(response => {
          console.log('/documents/ (response):', response)
          commit("saveRelatedDocs", response.data)
        })
      }
    }
  },

  mutations: {
    saveDocument(state, document) {
      state.document = document;
      state.loading = false;
    },
    saveRelatedDocs(state, docs) {
      state.relatedDocs = docs;
      state.loading = false;
    }
  },
};
