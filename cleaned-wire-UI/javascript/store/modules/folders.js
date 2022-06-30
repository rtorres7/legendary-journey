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

function fetchFolder(state, folderId) {
  return state.folders.folders.find((folder) => folder.id === folderId);
}

export default {
  namespaced: true,
  state: {
    loading: false,
    folders: [],
    showSpinner: false,
  },

  getters: {
    folders: (state) => {
      return state.folders;
    },
    loading: (state) => {
      return state.loading;
    },
    showSpinner: (state) => {
      return state.showSpinner;
    },
  },

  actions: {
    exportFolder(
      { state, commit },
      { exportType, folderId, articleIds, caller }
    ) {
      state.showSpinner = true;
      axios({
        method: "post",
        url: `/my_wire/folders/${folderId}/export.${exportType}`,
        data: { docs: articleIds },
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
            "exporting folder",
            error.response.data.error_message
          );
        });
    },
    removeArticlesFromFolder(
      { state, commit },
      { folderId, articleIds, caller }
    ) {
      state.showSpinner = true;
      let articlesList = {};
      articleIds.map((articleId) => (articlesList[articleId] = 1));
      let pageNum = caller.$route.query.page || 1;

      axios({
        method: "put",
        url: `/my_wire/folders/${folderId}`,
        data: { docs: articlesList, page: pageNum },
      })
        .then((response) => {
          state.showSpinner = false;
          let folder = fetchFolder(state, folderId);
          notifySuccessToUser(
            caller,
            "Documents removed",
            `Selected documents have been removed from the folder '${folder.name}'.`
          );
          folder.articles = response.data.articles;
          folder.document_count = response.data.document_count;
          folder.pages = response.data.pages;
          if (pageNum > folder.pages) {
            pageNum = folder.pages;
          }
          // set page number to last page if previous page no longer exists
          caller.$router.push({
            name: "folder",
            query: { page: pageNum },
            params: { folderId: folderId },
          });
        })
        .catch((error) => {
          state.showSpinner = false;
          notifyErrorToUser(caller, "removing articles", error.message);
        });
    },
    loadFolders({ state, commit }, { caller }) {
      state.loading = true;

      var query = Object.assign({}, caller.$route.query);
      query.page = query.page || 1;

      var params = Object.assign({}, caller.$route.params);
      let folderId = params.folderId || "";

      axios
        .get(`/my_wire/folders/${folderId}`, {
          params: query,
        })
        .then((response) => {
          commit("setFolders", response.data);
          state.loading = false;
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(caller, "loading articles", error.message);
        });
    },
    createFolder({ state, dispatch }, { folderName, caller }) {
      axios({
        method: "post",
        url: "/my_wire/folders",
        data: { folder: { name: folderName } },
      })
        .then((response) => {
          notifySuccessToUser(
            caller,
            "Folder created",
            `Folder '${folderName}' has been created.`
          );
          dispatch("loadFolders", caller);
        })
        .catch((error) => {
          state.loading = false;
          notifyErrorToUser(
            caller,
            "creating folder",
            error.response.data.error_message
          );
        });
    },
  },

  mutations: {
    setFolders(state, data) {
      state.folders = data;
    },
    setLoadingTrue(state, data) {
      state.folders = data;
    },
  },
};
