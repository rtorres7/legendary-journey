<template>
  <div class="pb-2">
    <CablePrintHeader
      v-if="isCable"
      :nonFintelWarning="nonFintelWarning"
      :document="document"
    />

    <div
      id="product_body"
      v-html="document.html_body"
      :class="document.reporting_type_value"
    ></div>

    <div
      id="met_person_disclaimer"
      class="well d-print-none"
      v-if="displayLeadershipFooter"
    >
      (_temp_42) If you have met the person or persons identified in this piece,
      _temp_6 leadership analysts would welcome the opportunity to meet with you
      for a debriefing. Please contact DA/APD/PDG/LPT at
      <a href="mailto:LP-Requests-Mailbox@_temp_6._temp_0"
        >LP-Requests-Mailbox@_temp_6._temp_0</a
      >
      to set up an appointment.
    </div>

    <div class="ncs_declass d-none d-print-block" v-if="isCable">
      <p
        class="subtitle"
        v-if="document.declass_block"
        v-html="document.declass_block"
      ></p>
    </div>

    <p v-if="isCable" class="text-danger text-bold text-lg">
      {{ nonFintelWarning }}
    </p>

    <ul class="hidden-pdf" v-if="pdfVersions && !isWire">
      <li v-for="pdf in pdfVersions" :key="pdf.binary_id" class="py-4">
        <strong>
          This product has a
          <a
            :href="`${attachmentLink}/${pdf.file_name}`"
            class="pdf_version"
            data-link-target="popup"
            data-width="600"
            data-height="800"
            >PDF version.</a
          >
        </strong>
      </li>
    </ul>
  </div>
</template>

<script>
import CablePrintHeader from "../document/CablePrintHeader";
import documentMixin from "@shared/mixins/documentMixin";

export default {
  name: "DocumentContents",
  mixins: [documentMixin],
  components: { CablePrintHeader },
  mounted() {
    if (this.$cookies) {
      $("#product_body").reading_metric({
        reporting_url: `/documents/${this.docNum}/document_read_metric`,
        position_url: $cookies.get("document_position_metric"),
      });
    }
  },
  computed: {
    attachmentLink() {
      return `/documents/${this.docNum}/attachments`;
    },
    displayLeadershipFooter() {
      return (
        this.isLeadership &&
        [
          "Leadership Profile",
          "Leadership Note",
          "Multibio",
          "Bio Highlight",
        ].includes(this.document.product_type_name)
      );
    },
    division() {
      return this.document.doc_num.match(/TD(X?)-33(0|4|5)/)
        ? "A DST"
        : "AN NCS";
    },
    pdfVersions() {
      if (this.document.attachments_metadata) {
        let pdfs = this.document.attachments_metadata.filter(
          (product) => product.pdf_version === true
        );
        return pdfs;
      }
    },
    nonFintelWarning() {
      return `${this.division} INFORMATION REPORT, NOT FINALLY EVALUATED _temp_340`;
    },
  },
};
</script>

<style scoped lang="scss">
.producing-office {
  font-style: italic;
}
</style>
