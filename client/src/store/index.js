import { createStore } from "vuex";
import alerts from "./modules/alerts";
import features from "./modules/features";
import search from "./modules/search";
import specialEdition from "./modules/specialEdition";
import specialEditions from "./modules/specialEditions";
import user from "./modules/user";
import savedSearches from "./modules/saved-searches";
import product from "./modules/product";
import testConsole from "./modules/test-console";
import metadata from "./modules/metadata";
import localStorage from "./modules/localStorage";
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
    alerts,
    features,
    search,
    specialEdition,
    specialEditions,
    user,
    savedSearches,
    product,
    testConsole,
    metadata,
    localStorage,
    relatedProducts,
    metrics,
    wires,
  },
});
