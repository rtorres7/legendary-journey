import { articleMetrics } from "@/data";
import axios from "@/config/wireAxios";
import router from "@/router";

const getMetricsForArticle = (metrics) => {
  const { doc_num } = router.currentRoute.value.params;
  const filteredMetrics = metrics.filter((data) => data.doc_num === doc_num);
  const metricsForArticle = (({ readership, uniqueReadership }) => ({
    readership,
    uniqueReadership,
  }))(filteredMetrics[0]);
  return metricsForArticle;
};

export default {
  namespaced: true,
  state: {
    uniqueReaders: 0,
    readership: [],
    loading: true,
  },
  actions: {
    getMetrics({ state, commit }, { start, end }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        const metrics = getMetricsForArticle(articleMetrics);
        // console.log("basic_metrics.json?readership_start_date="+state.readershipStartDate+"&readership_end_date="+state.readershipEndDate);
        console.log(
          "[store] getMetrics:",
          metrics,
          `params: start - ${start} , end - ${end}`
        );
        setTimeout(() => commit("importData", metrics), 900);
      } else {
        let route = router.currentRoute.value;
        axios.get(`/documents/${route.params.doc_num}`).then((response) => {
          axios
            .put(
              `/wires/${response.data.date_published}/articles/${response.data.id}/visitorCount`,
              {
                id: response.data.id,
                product_type_id: response.data.product_type_id,
              }
            )
            .then((response) => {
              console.log("/visitorCount (response): ", response);
              axios
                .get(
                  `/documents/${route.params.doc_num}/metrics/basic_metrics.json`,
                  {
                    params: {
                      readership_start_date: start,
                      readership_end_date: end,
                    },
                  }
                )
                .then((response) => {
                  console.log("[store] getMetrics:", response.data.metrics);
                  commit("importData", response.data.metrics);
                });
            });
        });
      }
    },
  },

  mutations: {
    importData(state, metrics) {
      state.uniqueReaders = metrics.uniqueReadership;
      state.readership = metrics.readership;
      state.loading = false;
    },
  },
};
