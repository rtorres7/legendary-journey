import Vue from "vue";

export default {
  namespaced: true,
  state: {
    criteria: {},
  },

  getters: {
    searchQuery(state) {
      var query = {};
      for (const criteriaName in state.criteria) {
        if (!query[criteriaName]) {
          query[criteriaName] = [];
        }
        const criteriaArray = state.criteria[criteriaName];
        for (const name in criteriaArray) {
          if (criteriaArray[name]) {
            query[criteriaName].push(name);
          }
        }
      }
      return query;
    },

    dateRange(state) {
      var startDate = null;
      var endDate = null;
      for (const startDateInd in state.criteria.start_date) {
        if (state.criteria.start_date[startDateInd]) {
          startDate = startDateInd;
        }
      }

      for (const endDateInd in state.criteria.end_date) {
        if (state.criteria.end_date[endDateInd]) {
          endDate = endDateInd;
        }
      }
      if (startDate && endDate) {
        return (
          startDate + ' <span class="fa fa-arrow-right mx-2"></span> ' + endDate
        );
      } else {
        return false;
      }
    },
  },

  mutations: {
    addCriteria(state, criteriaObj) {
      if (!state.criteria[criteriaObj.criteriaName]) {
        const cName = criteriaObj.name;
        var cObj = {};
        cObj[cName] = criteriaObj.value;
        Vue.set(state.criteria, criteriaObj.criteriaName, cObj);
        var bool = criteriaObj.criteriaName.replace("[]", "_bool");
      }
      if (Array.isArray(criteriaObj.name)) {
        for (const ind in criteriaObj.name) {
          const name = criteriaObj.name[ind];
          Vue.set(
            state.criteria[criteriaObj.criteriaName],
            name,
            criteriaObj.value
          );
        }
      } else {
        Vue.set(
          state.criteria[criteriaObj.criteriaName],
          criteriaObj.name,
          criteriaObj.value
        );
      }
    },

    clearCriteria(state) {
      state.criteria = {};
    },
  },
};
