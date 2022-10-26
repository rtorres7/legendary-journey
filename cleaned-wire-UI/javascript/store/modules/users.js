import axios from "axios";
import { capitalize, find, map } from "lodash";

function notifyErrorToUser(caller, action, error_message) {
  caller.$wireNotification({
    type: "error",
    title: `Error on ${action}`,
    text: `Failed to ${action}, please try again. ${error_message}`,
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
    roleForSelect: (state) => (roleName) => {
      let _temp_20 = find(state.assignableRoles, ["name", roleName]);
      return {
        text:
          _temp_20.name === "wire_editor" ? "WIRe Editor" : titleCase(_temp_20.name),
        value: _temp_20.name,
        description: _temp_20.description,
      };
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

    loadAssignableRoles({ state, commit }) {
      state.loading = true;
      axios
        .get("/admin/roles")
        .then((response) => {
          state.loading = false;
          commit("setAssignableRoles", response.data.assignableRoles);
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading assignable roles", error.message);
        });
    },

    loadTopTenUsers({ state, commit }, { caller }) {
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
        _temp_1: "/admin/users/" + userId + "/roles",
        data: { _temp_20: { name: userRole.name } },
      })
        .then(() => {
          caller.$wireNotification({
            group: "main",
            title: "_temp_20 Added",
            duration: 5000,
            text: titleCase(userRole.name) + " added",
            type: "success",
          });
          caller.$emit("roleUpdated");
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "adding _temp_20", error.message);
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
            title: "_temp_20 Removed",
            duration: 5000,
            text: titleCase(userRole.name) + " removed",
            type: "success",
          });
          state.processing = false;
        })
        .catch((error) => {
          state.processing = false;
          notifyErrorToUser(caller, "removing _temp_20", error.message);
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
        _temp_1: "/admin/users/" + userId + "/locks",
        data: {
          lock_event: lockEvent,
          lock_action: lockAction,
          user_id: userId,
        },
      })
        .then((response) => {
          caller.$wireNotification({
            title: response.data.success === true ? "Notice" : "Error",
            duration: 5000,
            text: response.data.details,
            type: response.data.success === true ? "success" : "error",
          });
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
