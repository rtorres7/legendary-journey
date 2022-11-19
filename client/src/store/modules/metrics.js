import { articleMetrics } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"

const getMetricsForArticle = (metrics) => {
  const route = router.currentRoute.value;
  const filteredMetrics = metrics.filter(data => data.doc_num === route.params.doc_num);
  const metricsForArticle = (({ readership, uniqueReadership }) => ({ readership, uniqueReadership }))(filteredMetrics[0]);
  return metricsForArticle;
};

export default {
  namespaced: true,
  state: {
    readershipStartDate: "",
    readershipEndDate: "",
    uniqueReaders: 0,
    readership: [],
    loading: true,
  },

  actions: {
    initDates({state, commit}, {readershipStartDate, readershipEndDate}) {
      state.loading = true;
      commit("saveStartDate", readershipStartDate);
      commit("saveEndDate", readershipEndDate);
    },
    getMetrics({ state, commit }) {
       state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        let metrics = getMetricsForArticle(articleMetrics);
        // console.log("basic_metrics.json?readership_start_date="+state.readershipStartDate+"&readership_end_date="+state.readershipEndDate);
        setTimeout(() => commit("importData", metrics), 750);
      } else {
          let route = router.currentRoute.value;
          axios.get("/documents/" + `${route.params.doc_num}/metrics/basic_metrics.json`,
            {
              params: {
                readership_start_date: state.readershipStartDate,
                readership_end_date: state.readershipEndDate
              }
            }
          )
          .then(response => {
            commit("importData", response.data.metrics);
          })
        }
    },
    updateStartDate({commit}, startDate) {
      commit("saveStartDate", startDate);
    },
    updateEndDate({commit}, endDate) {
      commit("saveEndDate", endDate)
    },
  },

  mutations: {
    importData(state, metrics) {
      state.uniqueReaders = metrics.uniqueReadership;
      state.readership = metrics.readership;
      state.loading = false;
    },
    saveStartDate(state, value) {
      state.readershipStartDate = value;
      state.loading = false;
     },
    saveEndDate(state, value) {
       state.readershipEndDate = value;
       state.loading = false;
    },
  },
};
