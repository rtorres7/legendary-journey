<template>
  <div
    v-if="hasInlineInteractives || document.product_image"
    class="col-xs-24 col-sm-8 col-md-8 col-lg-7 col-xl-6 pull-right article-image"
  >
    <div class="thumbnail">
      <div v-if="document.standalone">
        <a
          :data-overlay="standaloneDataOpts('overlay')"
          :data-link-target="standaloneDataOpts('link-target')"
          :data-media-type="standaloneDataOpts('media-type')"
          :data-title="document.standalone.file_name"
          :data-caption="standaloneDataOpts('caption')"
          :data-classification="standaloneDataOpts('classification')"
          :data-height="standaloneDataOpts('height')"
          :data-width="standaloneDataOpts('width')"
          :data-inline-width="standaloneDataOpts('inline-width')"
          :data-margin="standaloneDataOpts('margin')"
          :data-auto-play="standaloneDataOpts('auto-play')"
          :data-alignment="standaloneDataOpts('alignment')"
          :data-id="standaloneDataOpts('id')"
          :data-edit-_temp_1="standaloneDataOpts('edit-_temp_1')"
          :rel="document.standalone_link_opts.rel"
          class="media-body attachment-link"
          :id="standaloneDataOpts('id')"
          :href="standaloneUrl"
          ><img :src="imageUrl" alt="document image"
        /></a>
      </div>
      <img v-else :src="imageUrl" v-b-modal.doc-image alt="document image" />
    </div>
    <p class="caption text-italic">{{ document.image_caption }}</p>
    <b-modal id="doc-image" centered hide-footer>
      <div class="text-center">
        <img :src="imageUrl" class="image-style" alt="Enlarged Image" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isEmpty } from "lodash";

export default {
  name: "DocumentImage",
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageUrl() {
      let cacheBuster = this.$moment(this.document.updated_at).valueOf();
      return `/documents/${this.document.doc_num}/images/article?updated_at=${cacheBuster}`;
    },
    inlineInteractives() {
      if (this.document.attachments_metadata) {
        return this.document.attachments_metadata.filter(
          (product) =>
            product.visible === true && product.inline_interactive === true
        );
      }
    },
    hasInlineInteractives() {
      return !isEmpty(this.inlineInteractives);
    },
    standaloneUrl() {
      if (this.document.standalone) {
        return `/documents/${this.document.doc_num}/attachments/${this.document.standalone.file_name}?popup=true`;
      }
    },
  },
  methods: {
    standaloneDataOpts(optName) {
      if (this.document.standalone) {
        return this.document.standalone_link_opts.data[optName];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.image-style {
  width: 100%;
}
</style>
