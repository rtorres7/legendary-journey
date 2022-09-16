import { danielArticlesDetails } from "@/data";
import axios from "@/config/wireAxios";
import router from "@/router";

const extractData = (articles) => {
  return articles.map((article) => {
    if (article.data) {
      return article.data;
    }
    return article;
  });
};

export default {
  namespaced: true,
  state: {
    articles: [],
    loading: true,
  },

  actions: {
    getDanielArticleDetails({ state, commit }) {
      state.loading = true;
      if (process.env.NODE_ENV === "low") {
        let articleDetails = extractData(danielArticlesDetails)
          .filter((article) => {
            return article.doc_num === router.currentRoute.value.params.doc_num;  
        });
        commit("saveArticleDetails", articleDetails);
      } else {
          axios
            .get("/preload/documents/" + "WIRe2022-8675.json")
            .then((response) => {
              console.log("preload/documents/ (response): ", response);
              let articles = extractData(
                [
                  response?.data?.woah?.featured,
                  response?.data?.woah?.secondary,
                ].flat()
              );
              commit("saveArticleDetails", articles);
            });
        }
    },
  },

  mutations: {
    saveArticleDetails(state, article) {
      state.article = article;
      state.loading = false;
    },
  },
};
