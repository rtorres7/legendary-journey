<template>
  <b-card class="card-info pt-">
    <h2 class="info-title d-flex separator mt-5 pb-2">
      Adding Products to this Book
    </h2>

    <b-card-body align-v="center">
      <div align-v="center" class="box hover_area" id="add_tool">
        <div align-v="center" id="document_import_cont" _temp_20="form">
          <input
            type="file"
            name="attachment"
            style="display: none"
            multiple="multiple"
            data-_temp_1="/product_prepop"
          />
          <div align-v="center" class="drop-target uploader">
            <div class="upload-button" aria-label="Upload Product to Book">
              Drop or Click
            </div>
            <ul class="upload-list"></ul>
          </div>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: "WireProductUploader",
  mounted() {
    this.initFileUploader();
  },
  computed: {
    featureDate() {
      return this.$route.query.date || this.$route.params.date;
    },
  },
  methods: {
    initFileUploader() {
      let self = this;
      $("#document_import_cont .uploader").fileUploader({
        _temp_1: `/wires/${self.featureDate}/products`,
        containerSelector: "#document_import_cont",
        beforeSubmit: function (e, data) {
          data.formData = $.extend({}, data.formData, {
            publication_date: self.featureDate,
          });
        },
        complete: function (e) {
          // user will be redirected to edit document page
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}

.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-800;
  line-height: 1.5;
}

.uploader {
  color: $alt-800;
  outline: 2px dotted $alt-400;
  height: 90px;
  background-color: $alt-100;
  overflow: hidden;
  font-style: italic;
  cursor: pointer;
}

// Override styles defined in file_uploader.scss for jquery file upload plugin.
// Changing this will effect how upload feedback is displayed
.upload-button {
  background: $alt-100;
  border: none;
  height: 5px;
  padding-top: 0px;
  cursor: pointer;
  text-align: center;
  line-height: 90px;
}
</style>
