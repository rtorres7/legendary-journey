import { specialEditionLinks } from "@/data";
import axios from '@/config/wireAxios'

export default {
  namespaced: true,
  state: {
    loading: true,
    links: [],
  },

  actions: {
    loadConceptsLinks({ state, commit }) {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        setTimeout(() => commit("importLinks", specialEditionLinks), 750)
      } else {
        axios.get("/special_editions/links").then((response) => {
          console.log(`/special_editions (response):`, response);
          commit("importLinks", response.data);
        });
      }

    },
  },

  mutations: {
    importLinks(state, data) {
      state.loading = false;
      state.links = data.concepts;
    },
  },
};
