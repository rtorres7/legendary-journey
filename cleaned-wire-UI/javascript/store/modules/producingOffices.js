import axios from "axios";
import { flatten, reject } from "lodash";

function getDropdownValue(office) {
  let value = { text: office.value.user_label, value: office.value.id };
  if (Array.isArray(office.children) && office.children.length > 0) {
    let children = office.children.map((child) => {
      return getDropdownValue(child);
    });
    return flatten([value].concat(children));
  } else {
    return value;
  }
}

export default {
  namespaced: true,
  state: {
    error: false,
    loading: true,
    selectedNode: null,
    producingOffices: [],
    producingOfficeTitle: "",
    officeOrDivisionText: "",
    producingOfficeLabel: "",
    officeOrDivisionLabel: "",
  },
  getters: {
    officeOrDivision: (state) => {
      return state.selectedNode ? state.selectedNode.value : null;
    },
    officeOrDivisionList: (state) => {
      let blankValue = [{ text: "", value: null }];
      if (state.producingOffices.length > 0) {
        return flatten(
          blankValue.concat(
            state.producingOffices.values.map((office) => {
              return getDropdownValue(office);
            })
          )
        );
      } else {
        return [];
      }
    },
    officeOrDivisionParentList: (state) => (currentOffice) => {
      // exclude currentOffice and it's children from list
      let values = [{ text: "", value: null }];
      if (state.producingOffices.length > 0) {
        values = values
          .concat(
            state.producingOffices.values.map((office) => {
              return currentOffice.id === office.value.id
                ? []
                : getDropdownValue(office);
            })
          )
          .flat();
      }
      return reject(
        values,
        (office) => office.text.indexOf(currentOffice.user_label) > -1
      );
    },
    producingOfficeTitle: (state) => {
      return state.producingOfficeTitle;
    },
  },
  actions: {
    loadOfficesOrDivisions({ state, commit }) {
      state.loading = true;
      state.error = false;
      axios
        .get("/admin/producing_offices.json?time=" + Date.today())
        .then((response) => {
          commit("importProducingOffices", response.data.producingOffices);
          commit(
            "importProducingOfficeTitle",
            response.data.producingOfficeTitle
          );
          commit(
            "importOfficeOrDivisionText",
            response.data.officeOrDivisionText
          );
          commit(
            "importProducingOfficeLabel",
            response.data.producingOfficeLabel
          );
          commit(
            "importOfficeOrDivisionLabel",
            response.data.officeOrDivisionLabel
          );
          state.loading = false;
        })
        .catch((e) => {
          state.loading = false;
          state.error = true;
        });
    },
  },
  mutations: {
    setSelectedNode(state, selectedNode) {
      state.selectedNode = selectedNode;
    },
    importProducingOffices(state, producingOffices) {
      state.producingOffices = producingOffices;
    },
    importProducingOfficeTitle(state, producingOfficeTitle) {
      state.producingOfficeTitle = producingOfficeTitle;
    },
    importOfficeOrDivisionText(state, officeOrDivisionText) {
      state.officeOrDivisionText = officeOrDivisionText;
    },
    importProducingOfficeLabel(state, producingOfficeLabel) {
      state.producingOfficeLabel = producingOfficeLabel;
    },
    importOfficeOrDivisionLabel(state, officeOrDivisionLabel) {
      state.officeOrDivisionLabel = officeOrDivisionLabel;
    },
  },
};
