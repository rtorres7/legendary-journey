import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    feeds: [],
  },
  getters: {
    feeds: (state) => {
      return state.feeds;
    },
    loading: (state) => {
      return state.loading;
    },
  },
  actions: {
    loadRecommendedFeeds({ state, commit }) {
      state.loading = true;
      axios.get("/admin/recommended_feeds").then((response) => {
        commit("setFeeds", response.data["recommended_feeds"]);
      });
    },

    createRecommendedFeed({ state, dispatch }, { feed, caller }) {
      axios({
        method: "post",
        _temp_1: `/admin/recommended_feeds.json`,
        data: feed,
      })
        .then((response) => {
          caller.$wireNotification({
            type: "success",
            title: "Recommended Feed Created",
            text: `${feed.title} created.`,
          });
          dispatch("loadRecommendedFeeds", caller);
        })
        .catch((error) => {
          caller.$wireNotification({
            type: "error",
            title: "Recommended Feed Not Created",
            text: `${feed.title} not created, please try again: ${error.response.data.error_message}`,
          });
        });
    },
    updateRecommendedFeed({ state, dispatch }, { feed, caller }) {
      axios({
        method: "put",
        _temp_1: `/admin/recommended_feeds/${feed.id}.json`,
        data: feed,
      })
        .then((response) => {
          caller.$wireNotification({
            type: "success",
            title: "Recommended Feed Updated",
            text: `${feed.title} updated.`,
          });
          dispatch("loadRecommendedFeeds", caller);
        })
        .catch((error) => {
          caller.$wireNotification({
            type: "error",
            title: "Recommended Feed Not Updated",
            text: `${feed.title} was not updated, please try again: ${error.response.data.error_message}`,
          });
        });
    },
    deleteRecommendedFeed({ state, dispatch }, { feed, caller }) {
      axios({
        method: "delete",
        _temp_1: `/admin/recommended_feeds/${feed.id}.json`,
      })
        .then((response) => {
          caller.$wireNotification({
            type: "success",
            title: "Recommended Feed Deleted",
            text: `Attempting to delete ${feed.title}. This may take up to 10 minutes.`,
          });
          dispatch("loadRecommendedFeeds", caller);
        })
        .catch((error) => {
          caller.$wireNotification({
            type: "error",
            title: "Recommended Feed Not Deleted",
            text: `${feed.title} was not deleted, please try again: ${error.response.data.error_message}`,
          });
        });
    },
  },
  mutations: {
    setFeeds(state, data) {
      state.feeds = data;
      state.loading = false;
    },
  },
};
