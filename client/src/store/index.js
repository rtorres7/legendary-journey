import { createStore } from "vuex";
import articles from "./modules/articles";
import daniel from "./modules/daniel";
import danielSearch from "./modules/daniel-search";
import search from "./modules/search";
import specialEdition from "./modules/specialEdition";
import specialEditions from "./modules/specialEditions";
import user from "./modules/user";
import feeds from "./modules/feeds";
import formMetadata from "./modules/formMetadata";
import savedSearches from "./modules/saved-searches";
import danielDetails from "./modules/danielDetails";
import testConsole from "./modules/test-console";
import document from "./modules/document";
import metadata from "./modules/metadata";
import relatedProducts from "./modules/relatedProducts";
import metrics from "./modules/metrics";
import wires from "./modules/wires";

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
    articles,
    daniel,
    danielSearch,
    search,
    specialEdition,
    specialEditions,
    user,
    feeds,
    formMetadata,
    savedSearches,
    danielDetails,
    testConsole,
    document,
    metadata,
    relatedProducts,
    metrics,
    wires,
  },
});
