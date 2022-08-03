import { createStore } from 'vuex'
import articles from "./modules/articles";
import search from "./modules/search";
import user from "./modules/user";

export default createStore({
    state: {
        loading: true,
        errors: null,
        delay: false,
        admin: false
    },
    getters: {
    },
    actions: {
        delay: ({ commit }) => {
            commit("enableDelay");
        },
        removeDelay: ({ commit }) => {
            commit("disableDelay");
        },
        addAdmin: ({ commit }) => {
            commit("enableAdmin");
        },
        removeAdmin: ({ commit }) => {
            commit("disableAdmin");
        },
    },
    mutations: {
        enableDelay(state) {
            state.delay = true
        },
        disableDelay(state) {
            state.delay = false
        },
        enableAdmin(state) {
            state.admin = true
        },
        disableAdmin(state) {
            state.admin = false
        },
    },
    modules: {
        articles,
        search,
        user
    }
})
