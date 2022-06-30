import axios from "axios";

export default {
  namespaced: true,
  state: {
    articleList: [],
    preload: {},
    next: null,
    previous: null,
    listName: null,
    returnUrl: null,
  },

  actions: {
    preload({ state, commit }, docNum) {
      axios
        .get("/preload/documents/" + docNum + "/")
        .then((response) => {
          commit("importPreload", { docNum, data: response.data });
        })
        .catch((e) => {
          console.log("Something went wrong preloading " + docNum + " " + e);
        });
    },

    setNextPrevious: function ({ state, dispatch }, docNum) {
      for (let ind in state.articleList) {
        ind = parseInt(ind);
        var articleNum = state.articleList[ind];
        if (articleNum === docNum) {
          if (ind > 0) {
            state.previous = state.articleList[ind - 1];
            dispatch("preload", state.previous);
          } else {
            state.previous = null;
          }

          if (ind < state.articleList.length - 1) {
            state.next = state.articleList[ind + 1];
            dispatch("preload", state.next);
          } else {
            state.next = null;
          }
          return;
        }
      }
    },
  },

  mutations: {
    setArticleList(state, articles) {
      state.articleList = articles;
    },

    setListName(state, name) {
      state.listName = name;
    },

    setReturn(state, returnUrl) {
      state.returnUrl = returnUrl;
    },

    importPreload(state, docData) {
      state.preload[docData.docNum] = docData.data;
    },
  },
};
