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

const sortByDate = (a, b) => {
  const dateA = new Date(a.item.publication_date)
  const dateB = new Date(b.item.publication_date)
  if (dateA > dateB) {
    return -1;
  }
  if (dateA < dateB) {
    return 1;
  }
  return 0;
}

const search = (articles) => {
  const fuseSearch = new Fuse(articles, {
    includeScore: true,
    includeMatches: true,
    useExtendedSearch: true,
    keys: ["title", {
      name: 'summary',
      weight: 2
    }],
  });
  let route = router.currentRoute.value
  let results = fuseSearch.search(`'${route.query.text}`);
  switch (route.query.sort_dir) {
    case 'asc':
      return results.sort(sortByDate).reverse()
    case 'desc':
      return results.sort(sortByDate)
    default:
      return results
  }
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
          commit("importData", search(articles))
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
