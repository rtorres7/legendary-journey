import { createStore } from "vuex";
import currentModules from "@/current/store";

console.log("test: ", currentModules);

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
    ...currentModules,
  },
});
