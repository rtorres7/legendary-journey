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
      var _temp_1 = "/leadership_profiles/search.json?";
      _temp_1 += "per_page=5&";
      _temp_1 += "page=1&";
      _temp_1 += "country[]=" + country + "&";
      _temp_1 += "sort_column=posted_on&";
      _temp_1 += "sort_direction=desc";
      axios.get(_temp_1).then((response) => {
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
