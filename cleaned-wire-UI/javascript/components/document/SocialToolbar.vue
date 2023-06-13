<template>
  <b-col cols="1" class="d-print-none">
    <div class="d-flex mt-8 flex-column">
      <DocumentPrint
        v-if="!metadataLoading && featuresAvailable.documentPrint"
        :document="document"
        :printCount="printCount"
        @recordAction="recordAction"
      />

      <div
        class="px-3 pb-3"
        v-if="!metadataLoading && featuresAvailable.documentEmail"
      >
        <span class="badge badge-primary badge-pill count-indicator">{{
          emailCount
        }}</span>
        <a
          :href="emailLink"
          data-usage="doc-_temp_37"
          @click="recordAction('record_email')"
          @keydown.space.prevent="$event.srcElement.click"
        >
          <i
            id="_temp_37-link"
            class="fa fa-envelope social-toolbar"
            alt="_temp_37 document"
          />
        </a>
      </div>
      <div class="px-3 pb-2">
        <span
          v-if="comments.length !== 0"
          class="badge badge-primary badge-pill count-indicator"
          >{{ comments.length }}</span
        >
        <a
          id="discussionsLink"
          href="#comment-text"
          data-usage="doc-comment"
          @keydown.space.prevent="$event.srcElement.click"
        >
          <i
            id="discussion"
            class="fa fa-comment-o social-toolbar"
            alt="document comments"
          />
        </a>
      </div>
      <div class="px-3 pb-2">
        <DocumentFolder :document="document" />
        <i
          id="add-to-folder"
          class="fa fa-folder-open social-toolbar"
          data-usage="doc-add-to-folder"
          v-b-modal.folder-product
          alt="folders"
        />
      </div>

      <div v-if="!metadataLoading && featuresAvailable.tags" class="px-3 pb-3">
        <DocumentTag :document="document" />

        <i
          id="social-doc-tags"
          class="fa fa-tags social-toolbar"
          data-usage="doc-add-tag"
          v-b-modal.tag-product
          alt="tags"
        />
      </div>

      <div v-if="canViewDocumentAdminTools" class="px-3 pb-2">
        <DocumentAdminTools :document="document" />
        <i
          id="admin-tools"
          class="fa fa-cog social-toolbar"
          data-usage="doc-admin-cog"
          v-b-modal.product-admin-tools
          alt="admin tools"
        />
      </div>

      <div v-if="isFeaturedWire && canManageWire" class="px-3 pb-2">
        <a
          :href="editWireProductPath"
          data-usage="doc-edit"
          @keydown.space.prevent="$event.srcElement.click"
        >
          <i
            id="edit-product"
            class="fa fa-pencil social-toolbar"
            alt="edit document"
        /></a>
      </div>
    </div>
  </b-col>
</template>

<script>
import DocumentAdminTools from "../document/DocumentAdminTools";
import DocumentFolder from "../document/DocumentFolder";
import DocumentTag from "../document/DocumentTag";
import DocumentPrint from "../document/DocumentPrint";
import documentMixin from "@shared/mixins/documentMixin";
import axios from "axios";
import { mapGetters, mapState } from "vuex";

export default {
  name: "SocialToolbar",
  mixins: [documentMixin],
  components: {
    DocumentAdminTools,
    DocumentFolder,
    DocumentTag,
    DocumentPrint,
  },
  data() {
    return {
      emailCount: 0,
      printCount: 0,
    };
  },
  mounted() {
    this.emailCount = this.document.email_count;
    this.printCount = this.document.print_count;
    if (document.querySelector("#docPrintLink")) {
      document.querySelector("#docPrintLink").focus();
    } else if (document.querySelector("#discussionsLink")) {
      document.querySelector("#discussionsLink").focus();
    }
  },
  computed: {
    ...mapGetters("user", ["canManageWire", "canViewDocumentAdminTools"]),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable", "name"]),
    ...mapState("document", ["comments"]),
    isFeaturedWire() {
      return this.isWire && this.document.feature_id;
    },
    editWireProductPath() {
      let wirePubDate = this.formatDate(this.document.feature_date);
      return `/wires/${wirePubDate}/products/${this.document.feature_id}/edit`;
    },
    emailLink() {
      let emailSubject = `${this.name} product: ${this.portionMarkedTitle}`;
      let docURL = document.location.href.split("?")[0];
      return `mailto:?body=${docURL}&subject=${emailSubject}`;
    },
  },
  methods: {
    formatDate(date) {
      return this.$moment(date).format("YYYY-MM-DD");
    },
    recordAction(selectedAction) {
      axios({
        method: "POST",
        _temp_1: `${this.docPath}/${selectedAction}.js`,
      })
        .then((response) => {
          if (response.status === 200) {
            if (selectedAction === "record_email") {
              this.emailCount = response.data.count;
            }
            if (selectedAction === "record_print") {
              this.printCount = response.data.count;
            }
          }
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error: Something went wrong",
            text: "Please refresh this page in your browser and try again",
          });
        });
    },
  },
  watch: {
    document() {
      this.emailCount = this.document.email_count;
      this.printCount = this.document.print_count;
    },
  },
};
</script>

<style scoped lang="scss">
.social-toolbar {
  color: $alt-600;
  font-size: 24px;
  padding: 5px;
  &:hover {
    cursor: pointer;
  }
}
</style>
