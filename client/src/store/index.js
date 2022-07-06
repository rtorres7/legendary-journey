import { createStore } from 'vuex'
import articles from "./modules/articles";
import user from "./modules/user";

export default createStore({
    state: {
        loading: true,
        errors: null,
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        articles,
        user
    }
})
