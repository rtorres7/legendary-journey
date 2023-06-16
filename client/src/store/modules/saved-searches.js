//import router from "@/router"

// const sortByText = (a, b) => {
//   const lowerCaseA = a.text.toLowerCase()
//   const lowerCaseB = b.text.toLowerCase()
//   if (lowerCaseA < lowerCaseB) {
//     return -1;
//   }
//   if (lowerCaseA > lowerCaseB) {
//     return 1;
//   }
//   return 0;
// }

//const duplicateExists = (search)

export default {
  namespaced: true,
  state: {
    loading: true,
    cachedSearches: JSON.parse(localStorage.getItem("cachedSearches")) || [],
    systemSearches: [],
    // systemSearches: metadata.search_suggestions,
    searches: [],
  },

  actions: {
    getAllSearches: ({ commit, state }) => {
      let searches = state.cachedSearches.concat(state.systemSearches);
      console.log("[store] getAllSearchers: ", searches);
      commit("saveSearches", searches);
    },
    addSearch: ({ commit, state }, search) => {
      const searchExists = Boolean(
        state.searches.find(
          (item) => item.text.toLowerCase() === search.text.toLowerCase()
        )
      );
      //console.log('does search already exist? : ', searchExists)
      if (!searchExists) {
        let cachedSearches = state.cachedSearches;
        cachedSearches.push(search);
        commit("saveCachedSearches", cachedSearches);
        localStorage.setItem("cachedSearches", JSON.stringify(cachedSearches));
        //console.log('localStorage: ', localStorage)
        // let searches = state.searches
        //searches.push(search)
        //searches.sort(sortByText)
        commit("saveSearches", cachedSearches.concat(state.systemSearches));
      }
    },
    deleteSearch: ({ commit, state }, search) => {
      //console.log('search to be deleted: ', search)
      let cachedSearches = state.cachedSearches;
      cachedSearches = cachedSearches.filter(
        (cachedSearch) => cachedSearch.text !== search.text
      );
      //console.log('filtered out cached searches: ', cachedSearches)
      commit("saveCachedSearches", cachedSearches);
      localStorage.setItem("cachedSearches", JSON.stringify(cachedSearches));
      commit("saveSearches", cachedSearches.concat(state.systemSearches));
    },
  },

  getters: {
    searches: (state) => {
      return state.searches;
    },
  },

  mutations: {
    saveSearches(state, searches) {
      //console.log('sorted searches: ', searches)
      state.searches = searches;
      state.loading = false;
    },
    saveCachedSearches(state, searches) {
      state.cachedSearches = searches;
    },
    saveSystemSearches(state, searches) {
      state.systemSearches = searches;
    },
  },
};
