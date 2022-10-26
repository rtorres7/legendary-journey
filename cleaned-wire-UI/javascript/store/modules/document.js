import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    document: {},
    attachments: [],
    comments: [],
    multimedias: [],
    subscribed: false,
    tags: [],
  },

  actions: {
    retrieveComments({ state, commit }, { docNum }) {
      axios
        .get(`/documents/${docNum}/comments.json`)
        .then((response) => {
          commit("setComments", response.data);
          commit("setSubscribed", response.data.subscribed);
        })
        .catch((error) => {
          console.log("Failed to get comments.", error.response);
        });
    },
    toggleSubscription({ state, commit }, { docNum, caller }) {
      axios
        .put(`/documents/${docNum}/comment_subscription`)
        .then((response) => {
          commit("setSubscribed", !state.subscribed);
          caller.$wireNotification({
            title: "Article Subscription Updated",
            duration: 5000,
            text: "Your subscription to this article has been updated.",
            type: "success",
          });
        });
    },
    retrieveTags({ state, commit }, { docNum }) {
      axios
        .get(`/documents/${docNum}/tags.json`)
        .then((response) => {
          commit("setTags", response.data);
        })
        .catch((error) => {
          console.log("Failed to get tags. ", error.response);
        });
    },
  },

  getters: {
    loading: (state) => {
      return state.loading;
    },
  },

  mutations: {
    setComments(state, data) {
      state.comments = data.comments;
    },
    setLoadingOff(state) {
      state.loading = false;
    },
    setLoadingOn(state) {
      state.loading = true;
    },
    setSubscribed(state, isSubscribed) {
      state.subscribed = isSubscribed;
    },
    setTags(state, data) {
      state.tags = data.document.tags;
    },
  },
};
