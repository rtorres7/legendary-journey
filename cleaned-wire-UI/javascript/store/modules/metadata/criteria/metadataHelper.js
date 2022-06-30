import { assign, find } from "lodash";

export default {
  namespaced: true,

  mutations: {
    import(state, data) {
      assign(state, data);
    },
  },

  getters: {
    getValueForCode: (state) => (code) => {
      return find(state.values, function (item) {
        return item.code === code;
      });
    },

    getValueForName: (state) => (displayName) => {
      return find(state.values, function (item) {
        return item.name === displayName;
      });
    },
  },
};
