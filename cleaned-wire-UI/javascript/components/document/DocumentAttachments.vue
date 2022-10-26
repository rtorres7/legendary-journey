<template>
  <div>
    <h2 class="pri-800 separator pb-4">Attachments</h2>

    <div
      class="list-group-intro search_highlight"
      v-if="document.highlightAttachmentText"
    >
      {{ document.highlightAttachmentText }}
    </div>
    <div v-if="pdfVersions.length === 0 && attachments.length === 0">
      There are no attachments.
    </div>

    <li v-for="pdf in pdfVersions" :key="pdf.binary_id" class="py-4">
      <a
        :href="`${attachmentLink}/${pdf.file_name}`"
        class="pl-0 upcase"
        target="_blank"
        rel="nofollow"
        @focus="linkFocus"
        ><span class="fa fa-file-pdf-o pr-3"></span>PDF version of this
        product</a
      >
    </li>

    <li
      v-for="attachment in attachments"
      :key="attachment.binary_id"
      class="py-4"
    >
      <a
        :href="`${attachmentLink}/${attachment.file_name}`"
        class="pl-0"
        rel="nofollow"
        >{{
          attachment.title
            ? attachment.title
            : attachment.file_name.split(".")[0]
        }}</a
      ><small class="file_size"> ({{ fileSize(attachment.file_size) }})</small>
    </li>
  </div>
</template>

<script>
export default {
  name: "DocumentAttachments",
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    docNum() {
      return this.$route.params["docNum"] || this.document.doc_num;
    },
    attachmentLink() {
      return `/documents/${this.docNum}/attachments`;
    },
    pdfVersions() {
      let pdfs = this.document.attachments_metadata.filter(
        (product) => product.pdf_version === true && product.visible === true
      );
      return pdfs;
    },
    attachments() {
      let attachments_metadata = this.document.attachments_metadata.filter(
        (product) =>
          product.pdf_version !== true &&
          product.visible === true &&
          product.inline_interactive !== true &&
          product.type !== "PackagedMultimediaAttachment"
      );
      return attachments_metadata;
    },
  },
  methods: {
    fileSize(size) {
      var e = (Math.log(size) / Math.log(1024)) | 0;
      var num = (size / Math.pow(1024, e)).toFixed(1);
      return `${Math.round(num)} ${"KMGTPEZY"[e - 1]}B`;
    },
    linkFocus() {
      // Accessibility Fix -In Firefox when upon moving from the bottom of the
      // page (comment section) to the top again (Attachments), the scroll bar
      // does not move all the way, so the attachment section is not shown.
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}

li {
  list-style: none;
  padding: 0.5rem 0;
}
</style>
