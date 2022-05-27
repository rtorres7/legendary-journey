import baseMetadataStore from "./metadataHelper";
import { assign } from "lodash";

function parseStringIfObj(stringOrObj, desiredLabel) {
  return stringOrObj[desiredLabel] ? stringOrObj[desiredLabel] : stringOrObj;
}

export default {
  namespaced: true,
  state: {
    values: [],
    hierarchy: [],
  },

  mutations: {
    import(state, data) {
      const objData = data.map((tierOneOffice) => {
        return {
          parent: tierOneOffice[0],
          offices: tierOneOffice[1].map((tierTwoOffice) => {
            return {
              name: parseStringIfObj(tierTwoOffice[0], "name"),
              code: parseStringIfObj(tierTwoOffice[1], "label"),
              group: tierOneOffice[0],
            };
          }),
        };
      });
      assign(state, {
        hierarchy: objData,
        values: objData.flatMap((office) => office.offices),
      });
    },
  },
  ...baseMetadataStore.getters,
};
