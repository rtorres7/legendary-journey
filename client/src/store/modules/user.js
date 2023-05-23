import { user } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    loading: true,
    pretend: null,
    user: {
      authorizations: {},
      roles: [],
    },
  },

  getters: {
    user: (state) => {
      return state.user;
    },
    loading: (state) => {
      return state.loading;
    },
    authorizations: (state) => {
      return state.user.authorizations;
    },
    hasRole: (state) => (roleName) => {
      if (state.user.roles) {
        return state.user.roles.includes(roleName);
      }
      return false;
    },
    organization: (state) => {
      return state.user.organization;
    },
    isCommunityExclusive: (state) => {
      if (
        state.user.authorizations.canManageWire &&
        state.user.roles.includes("community_editor") &&
        !state.user.roles.includes("wire_editor")
      ) {
        return true;
      }
      return false;
    },
    canManageWire: (state) => {
      return state.user.authorizations.canManageWire;
    },
    canManageSpecialEditions: (state) => {
      return state.user.authorizations.canManageSpecialEditions;
    },
  },

  actions: {
    loadUser({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadUser: ", user);
        setTimeout(() => commit("importUser", user), 750);
      } else {
        axios.get("/my_wire/user_data").then((response) => {
          console.log("[store] loadUser: ", response.data);
          commit("importUser", response.data);
        });
      }
    },
    setAuthorization({ commit }, { auth, value }) {
      commit("toggleAuthorization", { auth, value });
    },
  },

  mutations: {
    importUser(state, data) {
      (state.user = data), (state.loading = false);
    },
    toggleAuthorization(state, { auth, value }) {
      state.user.authorizations[auth] = value;
    },
  },
};
