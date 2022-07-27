import { createStore } from 'vuex'
import articles from "./modules/articles";
import search from "./modules/search";
import user from "./modules/user";

export default createStore({
    state: {
        loading: true,
        errors: null,
        delay: false
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
    },
    mutations: {
        enableDelay(state) {
            state.delay = true
        },
        disableDelay(state) {
            state.delay = false
        },
    },
    modules: {
        articles,
        search,
        user
    }
})
