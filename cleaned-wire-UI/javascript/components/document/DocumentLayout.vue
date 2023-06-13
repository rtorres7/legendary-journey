<template>
  <div id="document" class="documents" :class="pageCssClass">
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      <spinner />
    </div>
    <div v-if="errored">
      <NotFound />
    </div>
    <div v-if="!authorized">
      <LockContent :document="document" />
    </div>
    <div v-if="!loading && !errored && authorized" :class="pdfCss">
      <PrintHeader :document="document" />
      <div class="print-body">
        <b-row class="pt-4 card-primary product" :class="docClassName">
          <slot name="socialToolbarOrPreviewDisclaimer"></slot>
          <b-col class="mr-auto" cols="23" lg="16">
            <div class="doc-classif product_classification">
              {{ document.classification }}
            </div>
            <p
              class="lp_disclaimer text-danger"
              v-if="document.pub_date_disclaimer"
            >
              {{ document.pub_date_disclaimer }}
            </p>
            <h1
              id="product_title"
              class="pri-800 separator mr-4 pb-2"
              :class="{ 'd-print-none': document.type !== 'WireDocument' }"
            >
              <span
                class="portion_marked_field"
                v-if="!document.display_title.match(titleRegex)"
                >({{ document.title_classif }})</span
              >
              <span v-html="document.name || document.display_title"></span>
            </h1>
            <div class="mt-6 pri-800 font-size-5 pb-4" id="document_category">
              {{ document.product_source }} -
              {{ formattedDate(document.display_date) }}
            </div>

            <b-row>
              <b-col class="pt-4 product-text product">
                <DocumentImage :document="document" />
                <DocumentLeadershipDetails :document="document" />
                <DocumentContents :document="document" />
                <DocumentDetails :document="document" v-if="authorized" />
                <Copyright class="d-none d-print-block text-x-sm" />
                <div class="text-center product_classification">
                  <div class="doc-classif pt-4">
                    <DeclassBlock :document="document" />
                    {{ document.classification }}
                  </div>
                </div>
                <slot name="documentComments"></slot>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="24" lg="6" class="d-print-none offset-lg-0 offset-1">
            <slot name="sideBar"></slot>
          </b-col>
        </b-row>
      </div>
      <PrintFooter :document="document" />
    </div>
  </div>
</template>

<script>
import Copyright from "../shared/Copyright";
import DeclassBlock from "../shared/DeclassBlock.vue";
import DocumentContents from "../document/DocumentContents";
import DocumentDetails from "../document/DocumentDetails";
import DocumentImage from "../document/DocumentImage";
import DocumentLeadershipDetails from "../document/DocumentLeadershipDetails";
import NotFound from "@shared/errors/NotFound";
import LockContent from "@shared/errors/LockContent";
import PrintHeader from "../shared/PrintHeader.vue";
import PrintFooter from "../shared/PrintFooter.vue";
import Spinner from "../shared/Spinner";
import { snakeCase } from "lodash";

/*
  This layout is used by Document and DocumentPreview components.
  These methods effect the document view, pdf and print styling.
*/
export default {
  name: "DocumentLayout",
  components: {
    Copyright,
    DeclassBlock,
    DocumentContents,
    DocumentDetails,
    DocumentImage,
    DocumentLeadershipDetails,
    NotFound,
    LockContent,
    PrintHeader,
    PrintFooter,
    Spinner,
  },
  data() {
    return {
      titleRegex: /^\([^)]*\)/,
    };
  },
  props: {
    document: {
      type: Object,
      required: false,
    },
    loading: {
      default: true,
    },
    errored: {
      default: false,
    },
    authorized: {
      default: true,
    },
  },
  computed: {
    docClassName() {
      return this.document ? snakeCase(this.document.type) : "";
    },
    docType() {
      return this.document.document_type
        ? snakeCase(this.document.document_type.toLowerCase())
        : "";
    },
    pdfCss() {
      let realFormat = document.querySelector(
        "meta[name='real-request-format']"
      );
      if (realFormat && realFormat.content === "pdf") {
        return "format-pdf";
      }
    },
    pageCssClass() {
      return this.errored ? "" : `standard-page-margin ${this.docType}`;
    },
  },
  methods: {
    formattedDate(value, showTime) {
      if (value) {
        let format = showTime ? "DD MMM YYYY HH:mm:ss" : "DD MMM YYYY";
        return this.$moment(value).format(format);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}
.product-text {
  font-size: $font-size-3;
}
.doc-classif {
  color: $alt-800;
  font-size: $font-size-2;
  text-align: center;
  padding-bottom: 0.75rem;
}
.lp_disclaimer {
  font-weight: bold;
  text-align: center;
}
</style>
