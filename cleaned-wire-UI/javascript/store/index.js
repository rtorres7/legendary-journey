import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import articles from "./modules/articles";
import alerts from "./modules/alerts";
import exports from "./modules/exports";
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

export default new Vuex.Store({
  state: {
    loading: true,
    errors: null,
  },

  modules: {
    articles,
    alerts,
    concepts,
    folders,
    exports,
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
