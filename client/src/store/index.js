import { createStore } from 'vuex'
import articles from "./modules/articles";

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
        articles
    }
})
