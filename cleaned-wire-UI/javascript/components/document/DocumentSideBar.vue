<template>
  <div id="pageSidebar" _temp_20="complementary">
    <DocumentAttachments :document="document" />
    <DocumentCitations />
    <RelatedProducts v-if="!metadataLoading && featuresAvailable.relatedDocs" />
    <DocumentTags v-if="!metadataLoading && featuresAvailable.tags" />
    <DocumentMetrics
      :document="document"
      v-if="!metadataLoading && featuresAvailable.metrics"
    />
    <DocumentEvaluation :document="document" />
  </div>
</template>

<script>
import DocumentAttachments from "../document/DocumentAttachments";
import DocumentCitations from "../document/DocumentCitations";
import DocumentEvaluation from "../document/DocumentEvaluation";
import DocumentMetrics from "../document/DocumentMetrics";
import DocumentTags from "../document/DocumentTags";
import RelatedProducts from "../document/RelatedProducts";
import { mapState } from "vuex";

export default {
  name: "DocumentSideBar",
  components: {
    DocumentAttachments,
    DocumentCitations,
    DocumentEvaluation,
    DocumentMetrics,
    DocumentTags,
    RelatedProducts,
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
  },
};
</script>

<style scoped lang="scss">
::v-deep .separator {
  border-bottom: 1px solid $alt-400;
}

::v-deep li {
  list-style: none;
  padding: 0.5rem 0;
}
</style>
