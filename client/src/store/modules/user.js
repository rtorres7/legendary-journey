import { inject } from 'vue'
import { user } from '@/data'

const axios = inject('$axios');

export default {
  namespaced: true,
  state: {
    loading: true,
    pretend: null,
    user: {},
  },

  getters: {
    user: (state) => {
      return state.user;
    },
    loading: (state) => {
      return state.loading;
    },
    hasRole: (state) => (roleName) => {
      if (state.user.roles) {
        return state.user.roles.includes(roleName);
      }
      return false;
    },
  },

  actions: {
    loadUser({ state, commit }) {
      state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        commit("importUser", user);
      } else {
        axios.get("/my_wire/user_data").then((response) => {
          commit("importUser", response.data);
        });
      }
    },
  },

  mutations: {
    importUser(state, data) {
      (state.user = data), (state.loading = false);
    },
  },
};
