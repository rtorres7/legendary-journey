import { specialEdition } from "@/data";
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
      let page = route.query.page || 1
      if (process.env.NODE_ENV === 'low') {
        setTimeout(() => commit("saveSpecialEdition", specialEdition), 750)
      } else {
        axios.get("/special_editions/" + `${route.params.id}`, { params: { page } }).then(response => {
          console.log(`/special_editions/${route.params.id} (response):`, response);
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
