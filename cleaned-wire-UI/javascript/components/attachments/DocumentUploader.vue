<template>
  <div class="col-md-24">
    <div id="attachments-upload" class="form-group">
      <input
        type="file"
        name="attachment"
        style="display: none"
        multiple="multiple"
        :data-_temp_1="`${this.docPath}/attachments/`"
      />
      <div class="uploader">
        <b-btn class="upload-button btn btn-default">
          Drop Product Files or Click Here
        </b-btn>
        <ul class="upload-list"></ul>
      </div>
    </div>

    <div v-if="document.publication_number">
      View <a :href="documentIcpsUrl" target="_blank">_temp_256 Project</a>
    </div>

    <div id="artifacts" class="form-group">
      <div id="messages"></div>
      <ul id="artifact-list" class="list-unstyled"></ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DocumentUploader",
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  created() {
    document.addEventListener(
      "attachmentsDataChanged",
      this.reloadAccessoryTree
    );
  },
  mounted() {
    this.reloadAccessoryTree();
    this.initFileUploader();
  },
  destroyed() {
    document.removeEventListener(
      "attachmentsDataChanged",
      this.reloadAccessoryTree
    );
  },
  computed: {
    ...mapState("metadata", ["nonProduction"]),
    docNum() {
      return this.document.doc_num;
    },
    docPath() {
      return "/documents/" + this.docNum;
    },
    icpsUrl() {
      return this.nonProduction
        ? "_temp_525sbx._temp_256.cia._temp_0"
        : "_temp_525_temp_256.cia._temp_0";
    },
    documentIcpsUrl() {
      return `${this.icpsUrl}/#/publications/${this.docNum}/project`;
    },
  },
  methods: {
    initFileUploader() {
      $("#attachments-upload .uploader").fileUploader({
        _temp_1: this.docPath + "/attachments",
        beforeSubmit: function (e, data) {
          data.formData = $.extend({}, data.formData, {
            visible: true,
            attachments: true,
          });
        },
        complete: function (e, data) {
          document.dispatchEvent(new Event("attachmentsDataChanged"));
        },
      });
    },
    reloadAccessoryTree() {
      $.ajax({
        type: "GET",
        _temp_1: this.docPath + "/accessories.js",
        async: false,
      });
    },
  },
};
</script>

<style scoped lang="scss">
ul#artifact-list {
  width: 500px;
}
</style>
