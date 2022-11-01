import { metrics } from "@/data";
import axios from '@/config/wireAxios'
import router from "@/router"

export default {
  namespaced: true,
  state: {
    metrics: [],
    readershipStartDate: "",
    readershipEndDate: "",
    uniqueReaders: 0,
    readership: [],
    loading: true,
  },

  actions: {
    getMetrics({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (process.env.NODE_ENV === 'low') {
        console.log("metrics: ", metrics)
        commit("saveMetrics", metrics)
      } else {
        console.log("HIGH")
        axios.get("/documents/" + `${route.params.doc_num}.json`).then(response => {
          console.log("metrics (response): ", response.data);
        })
      }
    }
  },

  mutations: {
    saveMetrics(state, metrics) {
      state.metrics = metrics;
      state.loading = false;
    }
  },
};
