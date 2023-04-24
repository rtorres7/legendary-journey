<template>
  <div id="document-details">
    <h2 class="pri-800 separator pb-2">Document Details</h2>
    <DocumentAttribution :document="document" />
    <DocumentAddressing :document="document" />
    <DocumentSources :document="document" class="d-print-none" />
  </div>
</template>

<script>
import DocumentAddressing from "../document/DocumentAddressing";
import DocumentAttribution from "../document/DocumentAttribution";
import DocumentSources from "../document/DocumentSources";

export default {
  name: "DocumentDetails",
  components: { DocumentAddressing, DocumentAttribution, DocumentSources },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // Expand any collapsed sections for printing
    if (typeof window.onbeforeprint !== "undefined") {
      window.onbeforeprint = function () {
        $("#document-details .collapse").show();
      };
    }
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400 !important;
}
</style>
