import { inject } from "vue";

export default {
  namespaced: true,
  state: {
    loading: true,
    document: {},
    attachments: [],
    comments: [],
    multimedia: [],
    subscribed: false,
    tags: [],
  },

  actions: {
    getComments({ commit }, { docNum }) {
      let wireAxios = inject('axios')
      wireAxios
        .get(`/documents/${docNum}/comments.json`)
        .then((response) => {
          commit("setComments", response.data);
          commit("setSubscribed", response.data.subscribed);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    toggleSubscription({ state, commit }, { docNum, caller }) {
      let wireAxios = inject('axios');
      wireAxios
        .put(`/documents/${docNum}/comment_subscription`)
        .then(() => {
          commit("setSubscribed", !state.subscribed),
          caller.$wireNotification({
            title: "Article Subscription Updated",
            duration: 5000,
            text: "Your subscription to this article has been updated.",
            type: "success",
          });
        });
    },
    getTags({ commit }, { docNum }) {
      let wireAxios = inject('axios');
      wireAxios
        .get(`/documents/${docNum}/tags.json`)
        .then((response) => {
          commit("setTags", response.data);
        })
        .catch((error) => {
          console.log(error.response);
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
