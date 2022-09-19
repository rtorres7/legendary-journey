import { danielArticlesDetails } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"
 
const extractData = (documents) => {
    return documents.map((document) => {
      if (document.data) {
        return document.data;
      }
      return document;
    });
};
 
export default {
    namespaced: true,
    state: {
      document,
      loading: true,
    },
  
    actions: {
        getDanielArticlesDetails({ state, commit }) {
            state.loading = true;
            if (process.env.NODE_ENV === 'low') {
                let documents = extractData(danielArticlesDetails);
                let route = router.currentRoute.value;
                console.log('danielArticlesDetails: ', danielArticlesDetails);
                let displayedDocument = documents.find((document) => document.doc_num === route.params.doc_num);
                commit("saveDocument", displayedDocument);
                return displayedDocument;
            } else {
                axios.get("/preload/documents/" + "WIRe2022-8675.json").then(response => {
                console.log('/preload/documents/ (response):', response);
                let document = extractData([response?.data?.woah?.featured, response?.data?.woah?.secondary].flat());
                commit("saveDocument", document);
                })
            }
        }
    },
  
  mutations: {
    saveDocument(state, document) {
      state.document = document;
      state.loading = false;
    },
  },
};
