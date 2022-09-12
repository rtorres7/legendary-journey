import Fuse from "fuse.js";
import { danielArticles } from "@/data"
import axios from '@/config/wireAxios'
import router from "@/router"

const extractAttributes = (articles) => {
  return articles.map((article) => {
    if (article.attributes) {
      return article.attributes;
    }
    return article;
  });
};

const search = (articles) => {
  const fuseSearch = new Fuse(articles, {
    keys: ["title", {
      name: 'summary',
      weight: 2
    }],
  });
  let route = router.currentRoute.value
  let results = fuseSearch.search(route.query.text);
  return route.query.sort_dir === 'asc' ? results.reverse() : results;
};

export default {
  namespaced: true,
  state: {
    loading: true,
    results: [],
    pages: 1,
    totalCount: null,
  },

  actions: {
    search: ({ commit, state }) => {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        let articles = extractAttributes(danielArticles)
        commit("importData", search(articles))
      } else {
        axios.get("/home/daniel").then(response => {
          console.log('/home/daniel (response):', response);
          let articles = extractAttributes([response?.data?.woah?.featured, response?.data?.woah?.secondary].flat())
          commit("saveArticles", search(articles))
        })
      }
    },
  },

  mutations: {
    importData(state, data) {
      console.log('search data: ', data);
      state.results = data
      state.pages = 1;
      state.totalCount = data.length
      state.loading = false;
    },
  },
};
