<template>
  <DocumentLayout :document="document" :loading="loading" :errored="errored">
    <template slot="socialToolbarOrPreviewDisclaimer">
      <b-col cols="24" v-if="showDisclaimer">
        <p id="preview-save-disclaimer" class="text-muted text-center">
          If you do not see the changes from the body of your document, please
          save the document and select preview again
        </p>
      </b-col>
    </template>
    <template slot="sideBar">
      <DocumentAttachments :document="document" id="pageSidebar" />
    </template>
  </DocumentLayout>
</template>

<script>
import DocumentAttachments from "../document/DocumentAttachments";
import DocumentLayout from "../document/DocumentLayout";
import axios from "axios";

export default {
  name: "DocumentPreview",
  components: {
    DocumentAttachments,
    DocumentLayout,
  },
  data() {
    return {
      document: {
        id: "",
        doc_num: "",
      },
      errored: false,
      loading: true,
    };
  },
  props: {
    documentNum: {
      type: String,
      required: false,
    },
    showDisclaimer: {
      default: false,
    },
  },
  mounted() {
    this.loading = true;
    this.retrieveDocument();
  },
  methods: {
    retrieveDocument() {
      let docNum = this.documentNum || this.$route.params["docNum"];
      axios
        .get(`/documents/${docNum}/preview.json?dt=${this.$moment()}`)
        .then((response) => {
          this.document = response.data;
          this.loading = false;
          this.$bvModal.show("wire-document-preview");
          this.$nextTick(() => {
            WIRe.scopedPageSetup($("#article_body"));
            this.$bus.$emit("addSourceLinkEventHandlers");
          });
        })
        .catch((error) => {
          this.errored = true;
          this.loading = false;
        });
    },
  },
};
</script>
