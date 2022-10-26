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
import Print from "./print/Print";
import ExportFrontPage from "./ExportFrontPage";
import PrintModal from "./print/PrintModal";
import { mapGetters, mapState } from "vuex";

export default {
  name: "UserFrontPageOptions",
  components: { PrintModal, Print, ExportFrontPage },
  computed: {
    ...mapGetters("user", ["canExportZip"]),
    ...mapState("metadata", ["featuresAvailable"]),
  },
};
</script>
