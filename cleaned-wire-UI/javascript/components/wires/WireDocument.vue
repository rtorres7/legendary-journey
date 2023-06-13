<template>
  <div>
    <div class="col-auto img_wrap">
      <template v-if="document.images && document.images.length > 0">
        <img
          :src="imgUrl('headline')"
          class="headline"
          alt=""
          v-if="mainView"
        />
        <img :src="imgUrl('product')" class="product" alt="" v-if="mainView" />
        <img :src="imgUrl('secondary')" class="secondary" alt="" v-else />
      </template>
      <img
        v-else
        alt=""
        :class="mainView ? 'product' : 'secondary'"
        :src="require('@/assets/wire-thumb-placeholder.jpg')"
      />
    </div>

    <DocumentLink
      :document="document"
      section="none"
      returnPath="/"
      class="title"
      v-if="mainView"
    />

    <p class="byline">
      {{ displayDate }} -
      <span class="reporting_type">
        {{ document.reporting_type_display_name }}</span
      >
      <span class="doc_ids">
        <span class="wire_doc_num"> {{ document.doc_num }}</span>
      </span>
    </p>

    <DocumentLink
      :document="document"
      section="none"
      returnPath="/"
      class="title"
      v-if="!mainView"
    />

    <p class="summary" v-if="document.summary">
      ({{ document.summary_classification }}) {{ truncatedSummary }}
    </p>
  </div>
</template>

<script>
import DocumentLink from "../shared/DocumentLink/index";

export default {
  name: "WireDocument",
  components: { DocumentLink },
  data() {
    return {
      truncateLength: 225,
    };
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
    mainView: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    displayDate() {
      let date = this.document.date_published
        ? this.document.date_published
        : this.document.posted_date;
      return this.$moment(date, "YYYY-MM-DD").format("DD MMM");
    },
    truncatedSummary() {
      if (this.document && this.document.summary) {
        if (this.document.summary.length >= this.truncateLength) {
          return (
            this.document.summary.substring(0, this.truncateLength) + "..."
          );
        } else {
          return this.document.summary;
        }
      }
    },
  },
  methods: {
    imgUrl(imgType) {
      return `/documents/${this.document.doc_num}/images/${imgType}`;
    },
  },
};
</script>

<style scoped lang="scss">
.sort-handle {
  padding: 0.5rem;
  cursor: move;
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}
.btn {
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}
</style>
