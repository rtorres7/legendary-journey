import { createStore } from 'vuex'
import articles from "./modules/articles";
import daniel from "./modules/daniel";
import danielSearch from "./modules/daniel-search"
import search from "./modules/search";
import user from "./modules/user";
import document from "./modules/document";

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
        daniel,
        danielSearch,
        search,
        user,
        document,
    }
})
