import { specialEditionLinks } from "@current/data";
import axios from "@/shared/config/wireAxios";

export default {
  namespaced: true,
  state: {
    loading: true,
    links: [],
  },

  actions: {
    loadConceptsLinks({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] loadConceptsLinks: ", specialEditionLinks);
        setTimeout(() => commit("importLinks", specialEditionLinks), 750);
      } else {
        axios.get("/feeds/links").then((response) => {
          console.log("[store] loadConceptsLinks: ", response);
          commit("importLinks", response.data);
        });
      }
    },
  },

  mutations: {
    importLinks(state, data) {
      state.loading = false;
      console.log("data: ", data);
      for (let feed of data) {
        if (feed.selectedReadings != null) {
          let selectedReadings = Array.from(
            feed.selectedReadings.matchAll(/"([\w]+)"/g)
          )
            .map((a) => a[1])
            .join("\n");
          console.log(selectedReadings);
        }
      }
      let links = {
        concepts: {
          posted: data.filter((a) => a.state === "Posted"),
          draft: data.filter((a) => a.state === "Draft"),
          archived: data.filter((a) => a.state === "Archived"),
        },
      };
      state.links = links.concepts;
    },
  },
};
