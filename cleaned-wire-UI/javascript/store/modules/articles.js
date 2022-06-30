import axios from "axios";

var defaultFeatured = [];
var defaultMore = [];

for (var i = 0; i < 13; i++) {
  if (i < 2) {
    defaultFeatured.push({ fake: true });
  }
  defaultMore.push({ fake: true });
}

export default {
  namespaced: true,
  state: {
    featured: defaultFeatured,
    more: defaultMore,
    headlineStack: [],
    headlineTitle: "",
    readersChoice: [],
    highlights: {},
    highlights_header: "",
    highlights_subtext: "",
    additionalContent: {},
    specialEditions: [],
    loading: true,
    secondaryLoading: true,
    preload: {},
    imagesLoaded: 0,
    daily_wire: [],
    siteEnhancement: [],
  },

  actions: {
    getHomeArticles({ state, commit }) {
      axios.get("/home").then((response) => {
        commit("saveArticles", response.data);
      });
    },

    getOtherWire({ state, commit }, date) {
      return axios.get("/wires/" + date).then((response) => {
        commit("saveArticles", response.data);
      });
    },

    getSideArticles({ state, commit }) {
      axios.get("/home/side_data").then((response) => {
        commit("loadSideData", response.data);
      });
    },

    preloadDocument({ commit }, docNum) {
      axios
        .get("/documents/" + docNum + "/")
        .then((response) => {
          commit("importPreload", { docNum, data: response.data });
        })
        .catch((e) => {
          console.log("Something went wrong preloading " + docNum + " " + e);
        });
    },
  },

  mutations: {
    saveArticles(state, articles) {
      state.featured = articles.featured;
      var results = [];
      if (articles.secondary) {
        results = results.concat(articles.secondary);
      }
      if (articles.more) {
        results = results.concat(articles.more);
      }
      state.siteEnhancement = articles.siteEnhancements;
      state.more = results;
      state.loading = false;
    },

    removeItemFromSiteEnhancements(state, item) {
      state.siteEnhancement = [];
    },

    resetHomePage(state) {
      state.loading = true;
      state.featured = [];
      state.more = [];
    },

    loadSideData(state, sideData) {
      state.headlineStack = sideData.headline_stack;
      state.headlineTitle = sideData.headline_title;
      state.highlights = sideData.highlights;
      state.highlights_header = sideData.highlights_header;
      state.highlights_subtext = sideData.highlights_subtext;
      state.additionalContent = sideData.additional_content;
      state.specialEditions = sideData.special_editions;
      state.daily_wire = sideData.daily_wire;
      state.secondaryLoading = false;
    },

    importPreload(state, preloadInfo) {
      state.preload[preloadInfo.docNum] = preloadInfo.data;
    },

    imageLoaded(state) {
      state.imagesLoaded += 1;
    },
  },
};
