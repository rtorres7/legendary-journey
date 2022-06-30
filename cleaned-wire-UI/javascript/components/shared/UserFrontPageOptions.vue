<template>
  <div>
    <b-dropdown
      v-if="canExportZip && featuresAvailable.exportFrontPage"
      right
      id="nav-userfrontpageoptions"
      text="Print/Export"
    >
      <Print v-if="featuresAvailable.frontPagePrintEnabled" />
      <ExportFrontPage v-if="featuresAvailable.exportFrontPage" />
    </b-dropdown>
    <Print :button="true" v-else-if="featuresAvailable.frontPagePrintEnabled" />
    <PrintModal />
  </div>
</template>

<script>
import axios from "axios";
import Print from "./print/Print";
import ExportFrontPage from "./ExportFrontPage";
import PrintModal from "./print/PrintModal";
import { mapState } from "vuex";

export default {
  name: "UserFrontPageOptions",
  components: { PrintModal, Print, ExportFrontPage },
  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
  },
  data() {
    return {
      canExportZip: false,
    };
  },

  mounted() {
    this.getRights();
  },

  methods: {
    getRights() {
      axios
        .get("/my_wire/permitted_to?permissions=export_zip&category=exports")
        .then((response) => {
          this.canExportZip = response.data.allowed || false;
        })
        .catch((response) => {
          this.canExportZip = false;
        });
    },
  },
};
</script>
