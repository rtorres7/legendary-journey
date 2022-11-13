import { danielArticles } from "@/data";
import axios from '@/config/wireAxios'
//import router from "@/router"

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
          const data = response.data.woah;
          let articles = []
          if (data) {
            if (data.featured) {
              articles = articles.concat(data.featured)
            }
            if (data.secondary) {
              articles = articles.concat(data.secondary)
            }
          }
          commit("saveArticles", articles)
        })
      }
    },
    getWireByDate({ state, commit }, date) {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        console.log('Wire: ');
      } else {
        axios.get("/wires/" + date + "/getWireByDate").then(response => {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~", response.data);
          let articles = response?.data?.features;
          commit("saveArticles", articles)
        });
      }
    },
    //Test Console Feature Only
    setDanielArticles({ commit }, count) {
      commit("saveArticles", count <= 0 ? [] : danielArticles.slice(0, count))
    },
    setLoading({ commit }, value) {
      commit("toggleLoading", value)
    },
  },

  mutations: {
    saveArticles(state, articles) {
      state.articles = articles;
      state.loading = false;
    },
    toggleLoading(state, value) {
      state.loading = value;
    },
  },
};
