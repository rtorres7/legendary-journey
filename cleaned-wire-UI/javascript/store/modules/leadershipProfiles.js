import axios from "axios";

export default {
  namespaced: true,
  state: {
    loading: true,
    leadershipProfiles: [],
  },

  actions: {
    getLeadersForCountry({ state, commit }, country) {
      state.loading = true;
      var url = "/leadership_profiles/search.json?";
      url += "per_page=5&";
      url += "page=1&";
      url += "country[]=" + country + "&";
      url += "sort_column=posted_on&";
      url += "sort_direction=desc";
      axios.get(url).then((response) => {
        commit("importLeadershipProfiles", response.data);
      });
    },
  },

  mutations: {
    importLeadershipProfiles(state, data) {
      state.leadershipProfiles = data.leadership_profiles;
      state.loading = false;
    },
  },
};
