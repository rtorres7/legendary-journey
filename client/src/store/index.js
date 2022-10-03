import { createStore } from 'vuex'
import articles from "./modules/articles";
import daniel from "./modules/daniel";
import danielSearch from "./modules/daniel-search"
import search from "./modules/search";
import user from "./modules/user";
import document from "./modules/document";
import feeds from "./modules/feeds"
import savedSearches from "./modules/saved-searches";
import danielDetails from "./modules/danielDetails";
import testConsole from "./modules/test-console";

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
    },
    mutations: {
    },
    modules: {
        articles,
        daniel,
        danielSearch,
        search,
        user,
        document,
        feeds,
        savedSearches,
        danielDetails,
        testConsole
    },
})
