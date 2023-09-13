import { specialEdition } from "@current/data";
import axios from "@/shared/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    loading: true,
    edition: {},
    pages: 1,
    notFound: false,
  },

  actions: {
    getSpecialEdition({ state, commit }) {
      state.loading = true;
      let route = router.currentRoute.value;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] getSpecialEdition: ", specialEdition);
        setTimeout(() => commit("saveSpecialEdition", specialEdition), 750);
      } else {
        axios
          .get("/feeds/" + `${route.params.id}`, {
            params: { page: route.query.page || 1 },
          })
          .then((response) => {
            console.log(`/feeds/${route.params.id} (response):`, response);
            let feed = response.data;
            if (feed.selectedReadings != null) {
              let selectedReadings = Array.from(
                feed.selectedReadings.matchAll(/"([\w]+)"/g)
              )
                .map((a) => a[1])
                .join("\n");
              feed.selectedReadings = selectedReadings;
            }
            console.log(feed);
            commit("saveSpecialEdition", feed);
          });
      }
    },
  },

  mutations: {
    saveSpecialEdition(state, specialEdition) {
      state.loading = false;
      if (specialEdition.notFound === true) {
        state.notFound = true;
      } else {
        state.edition = specialEdition;
        state.pages = specialEdition.totalPages;
      }
    },
  },
};
