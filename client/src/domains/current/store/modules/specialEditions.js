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
