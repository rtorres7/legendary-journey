import axios from "axios";

function notifySuccessToUser(caller, title, message) {
  caller.$wireNotification({
    type: "success",
    title: title,
    text: message,
  });
}

function notifyErrorToUser(caller, action, error_message) {
  caller.$wireNotification({
    type: "error",
    title: `Error on ${action}`,
    text: `Error on ${action}, please try again. ${error_message}`,
  });
}

function fetchTag(state, tagName) {
  let allTags = fetchAllTags(state);
  return allTags.find((tag) => tag.name === tagName);
}

function fetchAllTags(state) {
  // allTags is an array of arrays
  let allTags = state.tagGroups.tag_groups.map((tagGroup) => tagGroup.tags);
  return allTags.flat();
}

export default {
  namespaced: true,
  state: {
    loading: false,
    showSpinner: false,
    tagGroups: [{ tag_data: { tag_groups: [] } }],
    topTags: [],
    tag: { name: "unknown", document_count: 0, articles: [] },
    tagged_by: { first_name: "", last_name: "" },
  },

  getters: {
    tagGroups: (state) => {
      return state.tagGroups;
    },
    tag: (state) => {
      return state.tag;
    },
    taggedBy: (state) => {
      return state.tagged_by;
    },
    topTags: (state) => {
      return state.topTags;
    },
    loading: (state) => {
      return state.loading;
    },
    showSpinner: (state) => {
      return state.showSpinner;
    },
  },
  actions: {
    exportTag(
      { state, commit },
      { exportType, tagId, articleIds, userId, caller }
    ) {
      state.showSpinner = true;
      let data = articleIds.length > 0 ? { docs: articleIds } : {};

      // export only user docs if userId is set
      let exportUrl = `/tags/${tagId}/export.${exportType}`;
      if (userId !== undefined) {
        exportUrl = `/users/${userId}/tags/${tagId}/export.${exportType}`;
      }

      axios({
        method: "post",
        url: exportUrl,
        data: data,
      })
        .then((response) => {
          state.showSpinner = false;
          let notice =
            "Started export job. An email will be sent when the export is " +
            'complete. Existing exports can be seen on the <a href="/exports">My Exports</a> page.';
          notifySuccessToUser(caller, "Export started", notice);
        })
        .catch((error) => {
          state.showSpinner = false;
          notifyErrorToUser(
            caller,
            "exporting tag",
            error.response.data.error_message
          );
        });
    },
    removeArticlesFromTag(
      { state, dispatch },
      { groupName, tagName, articleIds, caller }
    ) {
      state.showSpinner = true;

      let tagsList = {};
      let currentUser = this.getters["user/user"];
      articleIds.map((articleId) => (tagsList[articleId] = 1));

      axios({
        method: "delete",
        url: `/users/${currentUser.id}/tags/${tagName}`,
        data: { docs: tagsList },
      })
        .then((response) => {
          dispatch("loadTagsForUser", {
            userId: currentUser.id,
            query: {
              tag_group: groupName,
              tag_name: tagName,
            },
            caller: caller,
          });
          notifySuccessToUser(
            caller,
            "Documents removed",
            `Selected documents have been removed from the tag '${tagName}'.`
          );
        })
        .catch((error) => {
          state.showSpinner = false;
          notifyErrorToUser(caller, "removing tags", error.message);
        });
    },
    loadTagsForUser(
      { state, commit },
      { userId, query, caller, showLoader = false }
    ) {
      if (showLoader === true) {
        state.loading = true;
      }
      state.showSpinner = true;
      commit("setTaggedBy", { first_name: "", last_name: "" });
      axios
        .get(`/users/${userId}/tags`, {
          params: query,
        })
        .then((response) => {
          commit("setTagGroups", response.data.tag_data);
          commit("setTopTags", response.data.tag_data.top_tags);
          commit("setTaggedBy", response.data.tag_data.tagged_by);
          state.showSpinner = false;
          state.loading = false;
        })
        .catch((error) => {
          state.showSpinner = false;
          state.loading = false;
          notifyErrorToUser(caller, "loading tags", error.message);
        });
    },
    loadAllTags({ state, commit }, { query, caller }) {
      state.loading = true;
      axios
        .get(`/tags`, {
          params: query || {},
        })
        .then((response) => {
          commit("setTagGroups", response.data);
          commit("setTopTags", response.data.top_tags);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading tags", error.message);
        });
    },
    loadTag({ state, commit }, { tagName, route, caller }) {
      state.loading = true;
      axios
        .get(`/tags/${tagName}`, {
          params: { tag_page: route.query.page },
        })
        .then((response) => {
          commit("setTag", response.data.tag_data);
          commit("setTopTags", response.data.top_tags);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading tags", error.message);
        });
    },
    loadDocs({ state, commit }, { tagName, route, caller }) {
      let tag = tagName;
      state.loading = true;
      let userId = route.params.id;
      axios
        .get(`/users/${userId}/tags/${tagName}`, {
          params: { tag_page: route.query.page },
        })
        .then((response) => {
          // set articles for given tag
          commit("setDocsForTag", {
            articles: response.data.articles,
            tagName: tag,
          });
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading docs for tag", error.message);
        });
    },
    searchTag({ state, commit }, { tagName, caller, pageNum }) {
      state.loading = true;
      pageNum = pageNum ? pageNum : 1;
      axios
        .get(`/tags/search?text=${tagName}&tag_page=${pageNum}`)
        .then((response) => {
          commit("setTagGroups", response.data);
          commit("setTopTags", response.data.top_tags);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading tags", error.message);
        });
    },
  },

  mutations: {
    setTagGroups(state, data) {
      state.tagGroups = data;
    },
    setTopTags(state, data) {
      state.topTags = data;
    },
    setTag(state, data) {
      state.tag = data;
    },
    setTaggedBy(state, data) {
      state.tagged_by = data;
    },
    setDocsForTag(state, { articles, tagName }) {
      let tag = fetchTag(state, tagName);
      tag.articles = articles;
    },
    setLoadingTrue(state) {
      state.loading = true;
    },
  },
};
