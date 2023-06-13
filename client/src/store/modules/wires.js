import { productsForWire } from "@/data";
import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    products: [],
    loading: true,
  },
  actions: {
    getWireByDate({ state, commit }, date) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        console.log("[store] getWireByDate: ", productsForWire);
        setTimeout(() => commit("saveProducts", productsForWire), 750);
      } else {
        axios.get("/wires/" + date + "/getWireByDate").then((response) => {
          console.log("[store] getWireByDate: ", response.data);
          commit("saveProducts", response?.data?.features);
        });
      }
    },
  },
  mutations: {
    saveProducts(state, products) {
      state.products = products;
      state.loading = false;
    },
  },
};
