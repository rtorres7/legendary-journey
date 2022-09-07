import axios from '@/config/wireAxios'

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
    getComments({ state, commit }, { docNum }) {
      axios
        .get(`/documents/${docNum}/comments.json`)
        .then((response) => {
          state.loading = false;
          commit("setComments", response.data);
          commit("setSubscribed", response.data.subscribed);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    toggleSubscription({ state, commit }, { docNum, caller }) {
      axios
        .put(`/documents/${docNum}/comment_subscription`)
        .then(() => {
          state.loading = false;
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
      axios
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
    setSubscribed(state, isSubscribed) {
      state.subscribed = isSubscribed;
    },
    setTags(state, data) {
      state.tags = data.document.tags;
    },
  },
};
