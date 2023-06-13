<template>
  <div v-if="canViewDocumentAdminTools">
    <b-modal
      id="product-admin-tools"
      size="lg"
      title="Product Admin Tools"
      title-class="modal-header-title"
      ok-title="Close"
      ok-only
      @hide="reloadDocument"
    >
      <b-card>
        <div class="row form-group">
          <b-col cols="23">
            <span id="document_selects" v-if="canManageSelects">
              <span v-if="selectedFor">
                <p class="text-italic">
                  This product was selected for
                  {{ selectedCategory }} on:
                  {{ $moment(selectedFor.updated_at).format("MM/DD/YYYY") }}
                </p>
                <div class="btn-group remove-select-link">
                  <b-button variant="warning" @click="removeProductSelection">
                    Remove from {{ selectedCategory }}
                  </b-button>
                </div>
              </span>
              <span v-else>
                <div class="btn-group btn-default">
                  <b-dropdown text="Select this product for..." v-if="selects">
                    <b-dropdown-item
                      v-for="option in selects"
                      :key="option.value"
                      @click="selectProductFor(option)"
                    >
                      {{ option.text }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </span>
            </span>

            <div class="btn-group" v-if="canManageFeatures">
              <span v-if="document.featuredToday">
                <b-button
                  variant="warning"
                  v-if="!confirmUnfeature"
                  @click="confirmUnfeature = true"
                >
                  <span class="fa fa-trash"> </span> Unfeature this product for
                  today
                </b-button>
                <span v-if="confirmUnfeature">
                  <b-button
                    aria-label="Are you sure you want to remove this product from being a feature on the front page? This will not delete the product, it will just remove it from the TOC for this date only."
                    @click="unfeatureProductForToday"
                    variant="danger"
                    ref="confirmUnfeatureButton"
                    >Confirm Unfeature for today
                  </b-button>
                  <b-button
                    class="mx-3"
                    size="sm"
                    variant="link"
                    @click="confirmUnfeature = false"
                  >
                    Cancel <span class="sr-only"> Unfeature for today</span>
                  </b-button>
                </span>
              </span>
              <b-button
                class="btn btn-default"
                @click="featureProductForToday"
                v-if="!document.featuredToday"
              >
                Feature this product for today
              </b-button>
            </div>

            <div class="btn-group" v-if="canUnpublishDocuments">
              <b-button
                variant="danger"
                @click="confirmUnpublish = true"
                v-if="!confirmUnpublish"
              >
                Unpublish this product
              </b-button>
              <span v-if="confirmUnpublish">
                <b-button
                  aria-label="WARNING: This will immediately remove this product from public display.\nAre you sure you want to do this?"
                  @click="unpublishProduct"
                  variant="danger"
                  ref="confirmUnpublishButton"
                  >Confirm Unpublish
                </b-button>

                <b-button
                  class="mx-0"
                  size="sm"
                  variant="link"
                  @click="confirmUnpublish = false"
                >
                  Cancel <span class="sr-only"> Unpublishing</span>
                </b-button>
              </span>
            </div>

            <div class="btn-group" v-if="canExportZip">
              <a
                class="btn btn-default"
                :href="`/documents/${document.doc_num}.zip`"
                @click="showExportMessage"
                >Export ZIP</a
              >
            </div>
          </b-col>
          <b-col cols="1" v-if="showLoader">
            <Spinner v-if="showLoader" size="32" />
          </b-col>
        </div>
        <div class="row form-group" v-if="canUpdateAttachments">
          <DocumentUploader :document="document" />
        </div>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import DocumentUploader from "../attachments/DocumentUploader";
import Spinner from "@shared/Spinner";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "DocumentAdminTools",
  components: { DocumentUploader, Spinner },
  data() {
    return {
      selects: [],
      confirmUnfeature: false,
      confirmUnpublish: false,
      showLoader: false,
    };
  },
  mounted() {
    this.populateSelects();
  },
  computed: {
    ...mapGetters("user", [
      "canExportZip",
      "canManageSelects",
      "canManageFeatures",
      "canUnpublishDocuments",
      "canUpdateAttachments",
      "canViewDocumentAdminTools",
    ]),
    selectedFor() {
      return this.document.selected_for;
    },
    selectedCategory() {
      if (this.selects.length > 0 && this.selectedFor) {
        return this.selects.find(
          (select) => this.selectedFor.category === select.value
        ).text;
      }
    },
    today() {
      return this.$moment().format("YYYY-MM-DD");
    },
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  methods: {
    reloadDocument() {
      this.$bus.$emit("reloadDocument");
    },
    populateSelects() {
      axios
        .get("/selects.json")
        .then((response) => {
          this.selects = response.data.selects;
        })
        .catch((e) => {
          console.error("Unable to retrieve values for selection. " + e);
        });
    },
    featureProductForToday() {
      this.showLoader = true;

      this.$store
        .dispatch("features/featureProduct", {
          featureDate: this.today,
          docNum: this.document.doc_num,
          caller: this,
        })
        .then(() => {
          this.showLoader = false;
          this.reloadDocument();
        });
    },
    unfeatureProductForToday() {
      this.showLoader = true;

      this.$store
        .dispatch("features/unfeatureProduct", {
          featureDate: this.today,
          featureId: this.document.featuredToday.id,
          caller: this,
        })
        .then(() => {
          this.confirmUnfeature = false;
          this.showLoader = false;
          this.reloadDocument();
        });
    },
    selectProductFor(selected) {
      this.showLoader = true;
      axios({
        method: "POST",
        _temp_1: "/selects",
        data: {
          select: { category: selected.value, document_id: this.document.id },
        },
      })
        .then((response) => {
          this.showLoader = false;
          this.reloadDocument();
          this.$wireNotification({
            type: "success",
            title: "Product Added To " + selected.text,
            text: "This product has been added to the " + selected.text,
          });
        })
        .catch((e) => {
          this.showLoader = false;
          this.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to add product to " + selected.text,
          });
        });
    },
    removeProductSelection() {
      this.showLoader = true;
      let categoryName = this.selectedFor.category;
      axios({
        method: "delete",
        _temp_1: `/selects/${this.selectedFor.id}`,
      })
        .then((response) => {
          this.showLoader = false;
          this.reloadDocument();
          this.$wireNotification({
            type: "success",
            title: "Product Removed from " + categoryName,
            text: "This product has been removed from " + categoryName,
          });
        })
        .catch((e) => {
          this.showLoader = false;
          this.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to remove product from " + categoryName,
          });
        });
    },
    unpublishProduct() {
      this.showLoader = true;
      axios({
        method: "POST",
        _temp_1: `/documents/${this.document.doc_num}/unpublish`,
      })
        .then((response) => {
          this.showLoader = false;
          if (response.status === 302) {
            this.$wireNotification({
              type: "success",
              title: "Product Unpublished",
              text: "This product has been unpublished",
            });
            this.$router.push({ name: "home" });
          }
        })
        .catch((e) => {
          this.showLoader = false;
          this.$wireNotification({
            type: "error",
            title: "Error",
            text: "Failed to unpublishing product",
          });
        });
    },
    showExportMessage() {
      this.$wireNotification({
        type: "success",
        title: `ZIP Export Requested for ${this.document.doc_num}`,
        text: "You will receive an _temp_37 notification when the export file has been completed.",
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
