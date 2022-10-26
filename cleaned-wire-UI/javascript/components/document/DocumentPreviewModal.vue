<template>
  <b-modal
    size="xl"
    id="wire-document-preview"
    title="Feature Document"
    title-class="modal-header-title"
    hide-footer
  >
    <DocumentPreview
      :documentNum="docNum"
      :showDisclaimer="true"
      v-if="docNum"
    />
  </b-modal>
</template>

<script>
import DocumentPreview from "../document/DocumentPreview";

export default {
  name: "DocumentPreviewModal",
  components: {
    DocumentPreview,
  },
  data() {
    return {
      docNum: document.getElementById("document_doc_num").value,
    };
  },
  mounted() {
    this.$bvModal.show("wire-document-preview");
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-body {
  padding: 20px 40px;
}
</style>
