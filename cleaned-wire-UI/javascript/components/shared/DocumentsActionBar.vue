<template>
  <div>
    <div v-if="articles.length > 0" class="d-flex mb-5">
      <span v-if="removeable" class="ml-auto">
        <span class="pl-0" v-if="confirm">
          <b-button
            :disabled="confirmClicked"
            :id="`confirm-delete-${entityId}`"
            class="confirm-delete ml-auto"
            size="sm"
            variant="danger"
            @click="deleteDocs"
          >
            Confirm {{ removeLabel }}?
          </b-button>
          <b-button
            class="mx-3"
            size="sm"
            variant="link"
            @click="confirm = false"
          >
            Cancel
          </b-button>
        </span>
        <b-btn
          v-if="!confirm"
          variant="link"
          @click.stop.prevent
          @click="askForConfirm"
          >{{ removeLabel }}<span class="sr-only"> documents</span>
        </b-btn>
        <span class="alt-800">|</span>
      </span>
      <b-dropdown
        :class="removeable ? '' : 'ml-auto'"
        :id="`export-options-${entityId}`"
        variant="link"
        :text="exportLabel"
        :aria-label="exportLabel"
        data-usage="export-documents"
      >
        <span class="sr-only"> documents</span>
        <template v-for="(exportOpt, idx) in exportFormatOptions">
          <b-dropdown-item
            class="export-option"
            @click="$emit('exportDocs', exportOpt.value)"
            :title="optionTitle[exportOpt.value]"
            :key="idx"
          >
            <span
              class="fa fa-fw"
              :class="optionCssClass[exportOpt.value]"
            ></span>
            {{ exportOpt.text }}
          </b-dropdown-item>
        </template>
      </b-dropdown>
    </div>
    <div v-else>{{ noItems }}</div>
    <div v-if="showSpinner">
      <spinner size="32" label="Processing Request" />
      <span class="sr-only">Processing Request</span>
    </div>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";
import { mapState } from "vuex";

export default {
  name: "DocumentsActionBar",
  components: { Spinner },
  props: {
    articles: {
      type: Array,
      default: [],
    },
    entityId: {
      type: String,
      required: true,
    },
    removeable: {
      type: Boolean,
      default: true,
    },
    noItems: {
      type: String,
      default: "No Documents Found.",
    },
    showSpinner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirm: false,
      confirmClicked: false,
      optionTitle: {
        csv: "Metadata for each article",
        pdf_book: "A single PDF of these articles",
        pdf_list: "A ZIP file of PDFs for each article",
        zip: "Each article in iPad-compliant format",
      },
      optionCssClass: {
        csv: "fa-file-excel-o",
        pdf_book: "fa-file-pdf-o",
        pdf_list: "fa-file-pdf-o",
        zip: "fa-file-zip-o",
      },
    };
  },
  mounted() {},
  computed: {
    ...mapState("metadata", ["exportFormatOptions"]),
    noDocSelected() {
      return this.articles.filter((doc) => doc.selected == true).length == 0;
    },
    removeLabel() {
      return this.noDocSelected ? "Remove All" : "Remove Selected";
    },
    exportLabel() {
      return this.noDocSelected ? "Export All" : "Export Selected";
    },
  },
  methods: {
    askForConfirm() {
      this.confirm = true;
      this.$nextTick(() => {
        let confirmDeleteBtn = document.querySelector(
          `#confirm-delete-${this.entityId}`
        );
        if (confirmDeleteBtn) {
          confirmDeleteBtn.focus();
        }
      });
    },
    deleteDocs() {
      this.confirmClicked = true;
      this.$emit("removeDocs");
      this.confirm = false;
      this.confirmClicked = false;
    },
  },
};
</script>
