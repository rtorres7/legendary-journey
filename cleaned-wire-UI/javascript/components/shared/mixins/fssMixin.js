import PortionMarkedString from "../PortionMarkedString";
import { isEmpty } from "lodash";

export default {
  components: { PortionMarkedString },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    documentLink: function () {
      return this.document.links[0].href;
    },
    docPostedDate: function () {
      return this.document.posted.substring(0, 10).replace(/-/g, "/");
    },
    formattedPostedDate: function () {
      return this.$moment(this.docPostedDate, "YYYY-MM-DDTHH:mm:ss").format(
        "D MMMM YYYY"
      );
    },
    locked: function () {
      return !this.document.accessible;
    },
  },
  methods: {
    mapClassificationToPortionMarkings: function (control) {
      switch (control.toUpperCase().replace(/_/g, " ")) {
        // US Classification Markings
        case "TOP _temp_451":
          return "TS";
        case "_temp_451":
          return "S";
        case "UNCLASSIFIED":
          return "U";
        // Non-US Protective Markings
        case "_temp_138 TOP _temp_451":
          return "CTS";
        case "NATO _temp_451":
          return "NS";
        case "NATO _temp_132":
          return "NC";
        case "NATO _temp_428":
          return "NR";
        case "NATO UNCLASSIFIED":
          return "NU";
        // Atomic Energy Act Information Markings
        case "_temp_183":
          return "DCNI";
        case "_temp_184":
          return "UCNI";
        // Dissemination Control Markings
        case "_temp_437":
          return "RS";
        case "_temp_371":
          return "OC";
        case "_temp_371-USGOV":
          return "_temp_367";
        case "_temp_258":
          return "IMC";
        case "_temp_359":
          return "_temp_353";
        case "_temp_396":
          return "PR";
        case "_temp_170":
          return "DEAS";
        // Non-Intelligence Community Dissemination Control Markings
        case "_temp_291":
          return "DS";
        case "EXDIS":
          return "XD";
        case "NODIS":
          return "ND";
        case "SBU _temp_359":
          return "SBU-_temp_353";
        case "LES _temp_359":
          return "LES-_temp_353";
        // Other
        case "_temp_428":
          return "R";
        default:
          return control;
      }
    },
    titlePortionMark: function (title) {
      let parts = [];

      if (isEmpty(title.classification)) {
        return "?";
      } else {
        let titleClassification = this.mapClassificationToPortionMarkings(
          title.classification
        );
        parts.push(titleClassification);
      }

      if (title.SCIcontrols) {
        let sciControls = title.SCIcontrols.map((control) => {
          return this.mapClassificationToPortionMarkings(control);
        }).join("/");
        parts.push(sciControls);
      }

      if (title.disseminationControls) {
        let dissemControls = title.disseminationControls
          .map((control) => {
            return this.mapClassificationToPortionMarkings(control);
          })
          .join("/");
        parts.push(dissemControls);
      }
      return parts.join("//");
    },
  },
};
