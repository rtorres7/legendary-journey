import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    feedbacks: [],
    pages: 1,
    totalCount: 0,
    statusOptions: [],
    reportingTypes: [],
    productTypes: [],
    producingOffices: [],
    countries: [],
    topics: [],
    exportData: "",
    searchCriteria: {},
    pageNotFound: false,
  },

  actions: {
    setSearchCriteria({ state, commit }, { caller }) {
      commit("setSearchCriteria", caller.buildSearchCriteria);
    },
    reclassify(
      { state, commit },
      { comment, previousClassification, commentClassification, caller }
    ) {
      commit("setLoadingOn");
      axios
        .patch(`/feedback_reviews/admin/reclassify/${comment.id}.json`, {
          comment: commentClassification,
        })
        .then((response) => {
          caller.$wireNotification({
            type: "success",
            title: "Notice",
            text: `Comment has been reclassified`,
          });
        })
        .catch((error) => {
          // revert to previous classification
          comment.classification = previousClassification.classification;
          comment.classification_xml =
            previousClassification.classification_xml;

          caller.$wireNotification({
            type: "error",
            title: "Comment Reclassification Error",
            duration: 5000,
            text: error.response.data.error_message,
          });
        });
      commit("setLoadingOff");
    },
    removeComment({ state, commit }, { commentId, caller }) {
      commit("setLoadingOn");
      axios
        .delete(`/feedback_reviews/${commentId}.json`, {})
        .then((response) => {
          // Removed comment ID by XXX
          caller.$wireNotification({
            type: "success",
            title: "Notice",
            text: `Removed comment #${commentId} by ${caller.comment.user.full_name}`,
          });
          this.dispatch("documentFeedbacks/retrieveFeedbacks", { caller });
        })
        .catch((error) => {
          console.error(error.response);
        });
    },
    async exportComments({ state, commit }, { commentIds, caller }) {
      commit("setLoadingOn");
      const searchfor = state.searchCriteria.searchfor;
      const response = await axios
        .get("/feedback_reviews/export.csv", {
          params: {
            ids: commentIds.join(","),
            searchfor: searchfor,
          },
        })
        .catch((error) => {
          console.error(error.response);
        });
      commit("setExportData", response.data);
      commit("setLoadingOff");
    },
    updateStatus({ state, commit }, { commentIds, status, caller }) {
      commit("setLoadingOn");
      axios
        .patch("/feedback_reviews/update_status.json", {
          ids: commentIds.join(","),
          status: status,
        })
        .then((response) => {
          caller.$wireNotification({
            type: "success",
            title: "Notice",
            text: `Updated ${commentIds.length} comments`,
          });
          this.dispatch("documentFeedbacks/search", { caller });
        })
        .catch((error) => {
          console.error(error.response);
        });
    },
    retrieveFeedbacks({ state, commit }, { caller }) {
      const query = Object.assign({}, caller.$route.query);
      query.page = query.page || 1;

      commit("setLoadingOn");
      return axios
        .get("/feedback_reviews.json", {
          params: query,
        })
        .then((response) => {
          commit("setDocumentFeedbacks", response.data);
          commit("setStatusOptions", response.data);
          commit("setReportingTypes", response.data);
          commit("setProductTypes", response.data);
          commit("setProducingOffices", response.data);
          commit("setCountries", response.data);
          commit("setTopics", response.data);
          commit("setLoadingOff");
        })
        .catch((error) => {
          console.error(error.response);
          if (error.response.status == 404) {
            state.pageNotFound = true;
          }
        });
    },
    search({ state, commit }, { caller }) {
      commit("clearResults");
      commit("setLoadingOn");
      this.totalCount = 0;
      const query = Object.assign({}, caller.$route.query);
      query.page = query.page || 1;
      const searchfor = this.getters["documentFeedbacks/searchCriteria"]
        .searchfor;
      if (searchfor) {
        searchfor.page = query.page;
      }
      // to keep it consistent with old non-Vue way, creating feedback search
      // first followed by getting search results with feedback search ID
      return axios
        .post("/feedback_reviews.json", {
          searchfor: searchfor,
        })
        .then((response) => {
          if (response.data.id) {
            axios
              .get(`/feedback_reviews/${response.data.id}`, {
                params: {
                  status_filter: searchfor.status,
                  page: query.page,
                },
              })
              .then((response) => {
                commit("setDocumentFeedbacks", response.data);
                commit("setStatusOptions", response.data);
                commit("setReportingTypes", response.data);
                commit("setProductTypes", response.data);
                commit("setProducingOffices", response.data);
                commit("setCountries", response.data);
                commit("setTopics", response.data);
              })
              .catch((error) => {
                console.error(error.response);
                if (error.response.status == 404) {
                  state.pageNotFound = true;
                }
              });
          } else {
            console.error("Failed to create document feedback search");
          }
          commit("setLoadingOff");
        })
        .catch(() => {
          throw new Error("Error creating document feedback search");
        });
    },
  },

  getters: {
    searchCriteria: (state) => {
      return state.searchCriteria;
    },
    exportData: (state) => {
      return state.exportData;
    },
    feedbacks: (state) => {
      return state.feedbacks;
    },
    loading: (state) => {
      return state.loading;
    },
    pages: (state) => {
      return state.pages;
    },
    statusOptions: (state) => {
      return state.statusOptions;
    },
    reportingTypes: (state) => {
      return state.reportingTypes;
    },
    productTypes: (state) => {
      return state.productTypes;
    },
    producingOffices: (state) => {
      return state.producingOffices;
    },
    countries: (state) => {
      return state.countries;
    },
    topics: (state) => {
      return state.topics;
    },
    totalCount: (state) => {
      return state.totalCount;
    },
    pageNotFound: (state) => {
      return state.pageNotFound;
    },
  },

  mutations: {
    setSearchCriteria(state, data) {
      state.searchCriteria = data;
    },
    setExportData(state, data) {
      state.exportData = data;
    },
    setTopics(state, data) {
      state.topics = data.topics;
    },
    setCountries(state, data) {
      state.countries = data.countries;
    },
    setStatusOptions(state, data) {
      state.statusOptions = data.status_options;
    },
    setReportingTypes(state, data) {
      state.reportingTypes = data.reporting_types;
    },
    setProductTypes(state, data) {
      state.productTypes = data.product_types;
    },
    setProducingOffices(state, data) {
      state.producingOffices = data.producing_offices;
    },
    setLoadingOff(state) {
      state.loading = false;
    },
    setLoadingOn(state) {
      state.loading = true;
    },
    setDocumentFeedbacks(state, data) {
      state.feedbacks = data.feedback_reviews;
      state.pages = data.pages;
      state.totalCount = data.total_count;
    },
    clearResults(state) {
      state.feedbacks = [];
    },
  },
};
