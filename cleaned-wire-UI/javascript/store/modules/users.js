import axios from "axios";
import { capitalize, map } from "lodash";

function notifyErrorToUser(caller, action, error_message) {
  caller.$wireNotification({
    type: "error",
    title: `Error on ${action}`,
    text: `Error on ${action}, please try again. ${error_message}`,
  });
}

function titleCase(value) {
  return map(value.split("_"), capitalize).join(" ");
}

export default {
  namespaced: true,
  state: {
    loading: false,
    processing: false,
    assignableRoles: [],
    user: {
      id: "",
      name: "",
      roles: [],
      lock_state: "",
    },
    users: {
      pages: 0,
      users: [],
    },
    topUsers: [],
    userLockHistory: [],
  },

  getters: {
    loading: (state) => {
      return state.loading;
    },
    processing: (state) => {
      return state.processing;
    },
    assignableRoles: (state) => {
      return state.assignableRoles;
    },
    topUsers: (state) => {
      return state.topUsers;
    },
    users: (state) => {
      return state.users;
    },
    user: (state) => {
      return state.user;
    },
    userLockHistory: (state) => {
      return state.userLockHistory;
    },
  },

  actions: {
    findUsers({ state, commit }, { route, caller }) {
      state.processing = true;
      axios
        .get(`/admin/users`, {
          params: route.query || {},
        })
        .then((response) => {
          commit("setUsers", response.data);
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "loading users", error.message);
        });
    },

    loadTopTenUsers({ state, commit }) {
      state.loading = true;
      axios
        .get("/admin/document_views")
        .then((response) => {
          state.loading = false;
          commit("setTopUsers", response.data.document_views);
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading top ten users", error.message);
        });
    },

    loadUser({ state, commit }, { userId, caller }) {
      state.loading = true;
      axios
        .get(`/admin/users/${userId}`)
        .then((response) => {
          commit("setUser", response.data.user);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading user", error.message);
        });
    },

    loadUserRoles({ state, commit }, { userId, caller }) {
      state.loading = true;
      axios
        .get(`/admin/users/${userId}/roles`)
        .then((response) => {
          // only update the user roles and name since full user data is not returned
          state.user.id = userId;
          state.user.roles = response.data.user.roles;
          state.user.name = response.data.user.name;
          commit("setUser", state.user);
          commit("setAssignableRoles", response.data.user.assignableRoles);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading user roles", error.message);
        });
    },

    addUserRole({ state, dispatch }, { userRole, caller }) {
      state.processing = true;
      let userId = userRole.user_id;

      axios({
        method: "post",
        url: "/admin/users/" + userId + "/roles",
        data: { role: { name: userRole.name } },
      })
        .then(() => {
          caller.$wireNotification({
            group: "main",
            title: "Role Added",
            duration: 5000,
            text: titleCase(userRole.name) + " added",
            type: "success",
          });
          caller.$emit("roleUpdated");
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "adding role", error.message);
        });
    },

    removeUserRole({ state, dispatch }, { userRole, caller }) {
      state.processing = true;
      let userId = userRole.user_id;

      axios
        .delete("/admin/users/" + userId + "/roles/" + userRole.id)
        .then(() => {
          dispatch("loadUserRoles", {
            userId: userId,
            caller: caller,
          });
          caller.$wireNotification({
            group: "main",
            title: "Role Removed",
            duration: 5000,
            text: titleCase(userRole.name) + " removed",
            type: "success",
          });
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "removing role", error.message);
        });
    },

    loadUserLockHistory({ state, commit }, { userId, caller }) {
      state.processing = true;
      axios
        .get(`/admin/users/${userId}/locks`)
        .then((response) => {
          commit("setUserLockHistory", response.data.user.lock_events);
          state.user.lock_state = response.data.user.lock_state;
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "loading user lock history", error.message);
        });
    },

    submitLockAction(
      { state, dispatch },
      { userId, lockAction, lockEvent, caller }
    ) {
      axios({
        method: "post",
        url: "/admin/users/" + userId + "/locks",
        data: {
          lock_event: lockEvent,
          lock_action: lockAction,
          user_id: userId,
        },
      })
        .then(() => {
          dispatch("loadUserLockHistory", {
            userId: userId,
            caller: caller,
          });
        })
        .catch((error) => {
          notifyErrorToUser(
            caller,
            titleCase(lockAction) + " user",
            error.message
          );
        });
    },
  },

  mutations: {
    setAssignableRoles(state, data) {
      state.assignableRoles = data;
    },
    setUserLockHistory(state, data) {
      state.userLockHistory = data;
    },
    setUser(state, data) {
      state.user = data;
    },
    setTopUsers(state, data) {
      state.topUsers = data;
    },
    setUsers(state, data) {
      state.users = data;
    },
  },
};
