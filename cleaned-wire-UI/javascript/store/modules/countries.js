import axios from "axios";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    loading: true,
    countries: {},
    countryArray: [],
  },

  actions: {
    loadCountries({ state, commit }) {
      state.loading = true;
      axios.get("/countries").then((response) => {
        commit("importCountries", response.data);
        commit("sendToMetaData");
      });
    },
  },

  getters: {
    countriesAsOptions(state) {
      var countries = {
        grouped: false,
        criteria: "countries[]",
        items: [],
      };
      for (const code in state.countries) {
        const country = state.countries[code];
        countries.items.push({
          code: code,
          text: country.name,
        });
      }
      return countries;
    },
  },

  mutations: {
    importCountries(state, data) {
      for (const d in data) {
        const country = data[d];
        Vue.set(state.countries, country.code, {
          digraph: country.digraph,
          name: country.name,
        });
      }
      state.loading = false;
    },

    sendToMetaData(state) {
      var values = {};
      for (const_temp_19in state.countries) {
        const country = state.countries[C];
        values[C] = country.name;
        state.countryArray.push({
          code: C,
          name: country.name,
        });
      }
      this.commit("metadata/addMeta", { countries: values });
    },
  },
};
