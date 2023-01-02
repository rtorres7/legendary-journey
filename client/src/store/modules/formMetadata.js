import axios from "@/config/wireAxios";

export default {
  namespaced: true,
  state: {
    dissem_orgs: {
      loading: true,
      items: [],
    },
    product_types: {
      loading: true,
      items: [],
    },
  },
  actions: {
    getDissemOrgs({ state, commit }) {
      state.dissem_orgs.loading = true;
      if (process.env.NODE_ENV === "low") {
        //low side metadata
      } else {
        axios.get("/wires/get_dissem_orgs").then((response) => {
          console.log("[store] getDissemOrgs: ", response.data.dissem_orgs);
          commit("saveOrgs", response?.data.dissem_orgs);
        });
      }
    },
    getProductTypes({ state, commit }) {
      state.product_types.loading = true;
      if (process.env.NODE_ENV === "low") {
        //low side metadta
      } else {
        axios.get("/wires/get_product_types").then((response) => {
          console.log(
            "[store] getProductTypes: ",
            response?.data.product_types
          );
          commit("saveProductTypes", response?.data.product_types);
        });
      }
    },
  },

  mutations: {
    saveOrgs(state, dissem_orgs) {
      state.dissem_orgs.items = dissem_orgs;
      state.dissem_orgs.loading = false;
    },
    saveProductTypes(state, product_types) {
      state.product_types.items = product_types;
      state.product_types.loading = false;
    },
  },
};
