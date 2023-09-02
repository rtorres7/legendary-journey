import { createStore } from "vuex";
import metadata from "./modules/metadata";
import testConsole from "./modules/test-console";
import user from "./modules/user";
import currentModules from "@current/store";

export default createStore({
  state: {
    loading: true,
    errors: null,
    delay: false,
    admin: false,
  },
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    metadata,
    testConsole,
    user,
    ...currentModules,
  },
});
