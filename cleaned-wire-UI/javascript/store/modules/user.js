import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    pretend: null,
    user: {
      authorizations: {},
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
    canExportZip: (state) => {
      return state.user.authorizations.canExportZip;
    },
    canManageRelatedProducts: (state) => {
      return state.user.authorizations.canManageRelatedProducts;
    },
    canUnpublishDocuments: (state) => {
      return state.user.authorizations.canUnpublishDocuments;
    },
    canUpdateAttachments: (state) => {
      return state.user.authorizations.canUpdateAttachments;
    },
    canManageSelects: (state) => {
      return state.user.authorizations.canManageSelects;
    },
    canManageFeatures: (state) => {
      return state.user.authorizations.canManageFeatures;
    },
    canManageWire: (state) => {
      return state.user.authorizations.canManageWire;
    },
    canManageUser: (state) => {
      return state.user.authorizations.canManageUser;
    },
    canManageUserRoles: (state) => {
      return state.user.authorizations.canManageUserRoles;
    },
    canManageLocks: (state) => {
      return state.user.authorizations.canManageLocks;
    },
    canManageSpecialEditions: (state) => {
      return state.user.authorizations.canManageSpecialEditions;
    },
    canUseMetrics: (state) => {
      return state.user.authorizations.canUseMetrics;
    },
    canPreviewWireSubscriptionEmail: (state) => {
      return state.user.authorizations.canPreviewWireSubscriptionEmail;
    },
    canViewDocumentAdminTools: (state) => {
      return state.user.authorizations.canViewDocumentAdminTools;
    },
  },

  actions: {
    loadUser({ state, commit }) {
      state.loading = true;
      axios.get("/my_wire/user_data?time=" + new Date()).then((response) => {
        commit("importUser", response.data);
      });
    },

    pretendUser({ state, commit }, pretendAs) {
      axios
        .put("/my_wire/preferences/pretends", {
          pretend_as: pretendAs,
        })
        .then(() => {
          commit("importPretend", pretendAs);
          location.reload();
        });
    },

    pretendStatus({ state, commit }) {
      axios
        .get("/my_wire/preferences/pretends?time=" + moment())
        .then((response) => {
          commit("importPretend", response.data.pretend);
        });
    },
  },

  mutations: {
    importUser(state, data) {
      (state.user = data), (state.loading = false);
    },

    updateRevisionsSubscription(state) {
      state.user.revisions_subscriber = !state.user.revisions_subscriber;
    },

    updateSubscription(state) {
      state.user.wire_subscriber = !state.user.wire_subscriber;
    },

    importPretend(state, pretendAs) {
      state.pretend = pretendAs === "normal" ? null : pretendAs;
    },
  },
};
