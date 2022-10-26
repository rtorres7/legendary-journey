<template>
  <div class="d-none d-print-block w-100">
    <div :class="`print-_temp_519 print-footer ${pageCssClass}`">
      <div class="declass-block-and-doc-num" v-if="document">
        <div
          class="declass-block"
          v-if="!document.classification.includes('UNCLASSIFIED')"
        >
          <template v-if="document.classification_detail">
            <div v-if="document.classification_detail.cl_by">
              <strong>Classified By: </strong>
              {{ document.classification_detail.cl_by }}
            </div>
            <div>
              <strong>Derived From:</strong>
              {{ document.classification_detail.drv_from }}
            </div>
            <div>
              <strong>Declassify On: </strong>
              {{ document.classification_detail.decl_on }}
            </div>
          </template>

          <p class="subtitle" v-else v-html="formattedDeclassBlock()"></p>
        </div>
        <span class="doc-num">{{ document.doc_num }}</span>
      </div>

      <div class="classification">
        <template v-if="!document">
          Classified By: 2229802 / Declassify On: Originator Review / Derived
          From: Multiple Sources
        </template>
        {{ document ? document.classification : siteClassification }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PrintFooter",
  computed: {
    ...mapState("metadata", ["siteClassification"]),
  },
  props: {
    document: {
      type: Object,
      required: false,
    },
    pageCssClass: {
      type: String,
      default: "first-page",
    },
  },
  methods: {
    formattedDeclassBlock() {
      if (this.document.declass_block) {
        return this.document.declass_block
          .replace(/:/g, ":</strong>")
          .replace(/<br \/>/, "<strong>")
          .replace(/^/g, "<strong>");
      }
    },
  },
};
</script>
