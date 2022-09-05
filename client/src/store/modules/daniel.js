import { danielArticles } from "@/data";
import axios from '@/config/wireAxios'


export default {
  namespaced: true,
  state: {
    articles: [],
    loading: true,
  },

  actions: {
    getDanielArticles({ state, commit }) {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        console.log('danielArticles: ', danielArticles)
        commit("saveArticles", danielArticles)
      } else {
        axios.get("/home/daniel").then(response => {
          console.log('/home/daniel (response):', response);
          let articles = [response?.data?.woah?.featured, response?.data?.woah?.secondary].flat();
          commit("saveArticles", articles)
        })
      }
    },
  },

  mutations: {
    saveArticles(state, articles) {
      state.articles = articles;
      state.loading = false;
    },
  },
};
