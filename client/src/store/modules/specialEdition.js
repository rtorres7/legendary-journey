//import { danielArticlesDetails } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"

export default {
  namespaced: true,
  state: {
    loading: true,
    edition: {},
    pages: 1,
    notFound: false
  },

  actions: {
    getSpecialEdition({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === 'low') {
        //let displayedDocument = danielArticlesDetails.find(({ data }) => data.doc_num === route.params.doc_num);
        commit("saveSpecialEdition", { totalPages: 2, name: 'Paris 2024 Olympics', notFound: false });
      } else {
        axios.get("/special_editions/" + `${route.params.id}`, { params: { page: route.query.page || 1 } }).then(response => {
          console.log('/special_editions/ (response):', response);
          commit("saveSpecialEdition", response.data);
        })
      }
    }
  },

  mutations: {
    saveSpecialEdition(state, specialEdition) {
      state.loading = false;
      if (specialEdition.notFound === true) {
        state.notFound = true;
      } else {
        state.edition = specialEdition
        state.pages = specialEdition.totalPages
      }
    },
  },
};
