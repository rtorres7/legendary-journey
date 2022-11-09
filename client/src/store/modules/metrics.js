import { articleMetrics } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"

const getMetricsForArticle = (metrics) => {
  let route = router.currentRoute.value;
  let metricsForArticle = metrics.filter(data => data.doc_num === route.params.doc_num);
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
    initDates({commit}, {readershipStartDate, readershipEndDate}) {
      commit("saveStartDate", readershipStartDate);
      commit("saveEndDate", readershipEndDate);
    },
    getMetrics({ state, commit }) {
       state.loading = true;
      if (process.env.NODE_ENV === 'low') {
        let metrics = getMetricsForArticle(articleMetrics);
        console.log("basic_metrics.json?readership_start_date="+state.readershipStartDate+"&readership_end_date="+state.readershipEndDate);
        commit("importData", metrics);
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
            // console.log("metrics (response): ", response.data);
            commit("importData", response.data);
          })
        }
    },
    updateStartDate({commit}, startDate) {
       commit("saveStartDate", startDate)
    },
    updateEndDate({commit}, endDate) {
       commit("saveEndDate", endDate)
    },
  },

  mutations: {
    importData(state, data) {
       state.uniqueReaders = data[0].uniqueReadership;
      state.readership = data[0].readership;
    },
    saveStartDate(state, value) {
      state.readershipStartDate = value
     },
    saveEndDate(state, value) {
       state.readershipEndDate = value
    },
  },
};
