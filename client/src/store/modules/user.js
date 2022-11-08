import { user } from '@/data'
import axios from '@/config/wireAxios'

export default {
  namespaced: true,
  state: {
    loading: true,
    pretend: null,
    user: {
      authorizations: {
      },
    },
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
    canManageSpecialEditions: (state) => {
      return state.user.authorizations.canManageSpecialEditions;
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
