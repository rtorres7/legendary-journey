<template>
  <div>
    <div v-if="articles.length > 0" class="d-flex mb-5">
      <span v-if="removeable" class="ml-auto">
        <span class="_temp_488-0" v-if="confirm">
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
        <b-dropdown-item
          class="export-option"
          @click="$emit('exportDocs', 'pdf_book')"
          title="A single PDF of these articles"
        >
          <span class="fa fa-file-pdf-o fa-fw"></span> PDF Book
        </b-dropdown-item>
        <b-dropdown-item
          @click="$emit('exportDocs', 'pdf_list')"
          title="A ZIP file of PDFs for each article"
        >
          <span class="fa fa-file-pdf-o fa-fw"></span> PDF Files
        </b-dropdown-item>
        <b-dropdown-item
          @click="$emit('exportDocs', 'csv')"
          title="Metadata for each article"
        >
          <span class="fa fa-file-excel-o fa-fw"></span> CSV File
        </b-dropdown-item>
        <b-dropdown-item
          @click="$emit('exportDocs', 'zip')"
          title="Each article in iPad-compliant format"
        >
          <span class="fa fa-file-zip-o fa-fw"></span> ZIP File
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-else>{{ noItems }}</div>
    <div
      v-if="showSpinner"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      <spinner size="32" label="Processing Request" />
      <span class="sr-only">Processing Request</span>
    </div>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";

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
    };
  },
  computed: {
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
