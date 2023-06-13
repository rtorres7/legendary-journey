import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import products from "./modules/products";
import alerts from "./modules/alerts";
import document from "./modules/document";
import exports from "./modules/exports";
import features from "./modules/features";
import leadershipLinks from "./modules/leadershipLinks";
import logo from "./modules/logo";
import programOfAnalysisLinks from "./modules/programOfAnalysisLinks";
import savedSearches from "./modules/savedSearches";
import search from "./modules/search";
import concepts from "./modules/concepts";
import navmodal from "./modules/navmodal";
import metadata from "./modules/metadata/index";
import user from "./modules/user";
import users from "./modules/users";
import portlets from "./modules/portlets";
import folders from "./modules/folders";
import tags from "./modules/tags";
import documentFeedbacks from "./modules/documentFeedbacks";
import feeds from "./modules/feeds";
import producingOffices from "./modules/producingOffices";

export default new Vuex.Store({
  state: {
    loading: true,
    errors: null,
  },

  modules: {
    products,
    alerts,
    concepts,
    document,
    exports,
    features,
    folders,
    leadershipLinks,
    logo,
    programOfAnalysisLinks,
    savedSearches,
    search,
    metadata,
    navmodal,
    tags,
    user,
    users,
    portlets,
    documentFeedbacks,
    feeds,
    producingOffices,
  },

  actions: {
    firstLoad() {
      this.dispatch("metadata/import");
      this.dispatch("programOfAnalysisLinks/loadProgramOfAnalysisLinks");
      this.dispatch("alerts/loadAlerts");
      this.dispatch("savedSearches/loadSavedSearches");
      this.dispatch("user/loadUser");
      this.dispatch("user/pretendStatus");
      this.dispatch("logo/loadLogoInfo");
    },
  },
});
