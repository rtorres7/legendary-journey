import axios from "axios";

export default {
  namespaced: true,
  state: {
    productList: [],
    preload: {},
    next: null,
    previous: null,
    listName: null,
    returnUrl: null,
  },

  actions: {
    preload({ state, commit }, docNum) {
      axios
        .get("/preload/documents/" + docNum + ".json")
        .then((response) => {
          commit("importPreload", { docNum, data: response.data });
        })
        .catch((e) => {
          console.log("Something went wrong preloading " + docNum + " " + e);
        });
    },

    setNextPrevious: function ({ state, dispatch }, docNum) {
      for (let ind in state.productList) {
        ind = parseInt(ind);
        var productNum = state.productList[ind];
        if (productNum === docNum) {
          if (ind > 0) {
            state.previous = state.productList[ind - 1];
          } else {
            state.previous = null;
          }

          if (ind < state.productList.length - 1) {
            state.next = state.productList[ind + 1];
          } else {
            state.next = null;
          }
          return;
        }
      }
    },
  },

  mutations: {
    setProductList(state, products) {
      state.productList = products;
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
