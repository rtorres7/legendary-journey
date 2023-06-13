<template>
  <div v-if="pageNotFound">
    <NotFound />
  </div>
  <div
    v-else
    @search-performed="focusChangeStatus"
    class="mt-6 pb-8 standard-page-margin review-document-feedback"
  >
    <vanity-title title="Document Feedback"></vanity-title>
    <b-row>
      <b-col cols="20" lg="18">
        <b-row class="mt-6 mb-6">
          <b-col>
            Select items to
            <b-btn
              variant="link"
              class="p-0"
              @click="changeStatus"
              id="changeStatusLink"
              >change status</b-btn
            >, or
            <b-btn
              variant="link"
              class="p-0"
              id="exportLink"
              @click="enableExportComments"
            >
              export</b-btn
            >
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center feedback-group-actions">
          <b-col
            class="pt-5"
            cols="md-3"
            v-if="showDocumentSelectionCheckboxes && !exportEnabled"
          >
            <b-form-checkbox
              id="selectAllCheckbox"
              v-if="displaySelectAll"
              @change="toggleSelectAll"
              v-model="selectAllOption"
              tabindex="0"
            >
              Select All</b-form-checkbox
            >
          </b-col>
          <b-col class="pt-4" cols="md-6" v-if="showChangeStatus">
            <b-form-select
              v-model="selectedStatus"
              :options="updateStatusList"
              aria-label="Select Status"
            >
            </b-form-select>
          </b-col>
          <b-col class="pt-4">
            <b-btn
              :disabled="statusNotSelected"
              variant="primary"
              @click="updateStatus"
              class="ml-4"
              v-if="showChangeStatus"
              >Change
            </b-btn>
            <b-btn
              variant="primary"
              @click="exportComments"
              class="ml-4"
              v-if="exportEnabled"
              >Export {{ exportSelected }}
            </b-btn>
            <b-btn
              variant="secondary"
              class="ml-4"
              @click="cancelActions"
              v-if="showCancelButton"
              >Cancel
            </b-btn>
          </b-col>
        </b-row>
        <div v-if="loading">
          <spinner />
        </div>
        <div v-else-if="totalCount == 0">
          <div class="d-flex justify-content-center mt-8 sorry-text">
            Sorry, we didn't find any results.
          </div>
        </div>
        <b-row v-else>
          <b-col>
            <Card
              v-for="(feedback, index) in this.feedbacks"
              :key="feedback.doc_num"
              :product="feedback.document"
              :comment="feedback"
              :index="index"
              :return-path="$route.fullPath"
              :displayCheckBoxes="showDocumentSelectionCheckboxes"
            />
          </b-col>
        </b-row>

        <div class="overflow-auto text-center mt-5" v-if="pages > 1">
          <div class="d-flex justify-content-center">
            <b-pagination-nav
              :link-gen="paginationLink"
              :number-of-pages="pages"
              :value="$route.query.page || 1"
              @change="searchFeedbacks"
            ></b-pagination-nav>
          </div>
        </div>
      </b-col>
      <ReviewDocumentFeedbackFilters />
    </b-row>
  </div>
</template>

<script>
import ReviewDocumentFeedbackFilters from "./ReviewDocumentFeedbackFilters";
import VanityTitle from "../vanity/VanityTitle";
import Spinner from "../shared/Spinner";
import Card from "./Card";
import NotFound from "../shared/errors/NotFound";
import { mapGetters } from "vuex";

export default {
  name: "ReviewDocumentFeedback",
  components: {
    ReviewDocumentFeedbackFilters,
    VanityTitle,
    Spinner,
    Card,
    NotFound,
  },

  data() {
    return {
      showDocumentSelectionCheckboxes: false,
      selectedStatus: "",
      selectAllOption: false,
      exportEnabled: false,
      showChangeStatus: false,
      showCancelButton: false,
      displaySelectAll: true,
    };
  },
  mounted() {
    this.loadFeedbacks();
    this.$bus.$on("searchPerformed", () => {
      this.focusChangeStatus();
      this.cancelActions();
    });
  },
  computed: {
    ...mapGetters("documentFeedbacks", [
      "feedbacks",
      "loading",
      "pages",
      "statusOptions",
      "exportData",
      "totalCount",
      "pageNotFound",
      "searchCriteria",
    ]),
    statusNotSelected() {
      return this.selectedStatus === "" || this.selectedStatus === null;
    },
    exportSelected() {
      return this.selectedComments().length > 0 ? "Selected" : "All";
    },
    updateStatusList() {
      return [
        {
          text: "(Any comment Status Selected)",
          value: null,
        },
      ].concat(this.statusOptions);
    },
  },
  methods: {
    focusChangeStatus() {
      const changeStatusLink = document.querySelector("#changeStatusLink");
      if (changeStatusLink) {
        changeStatusLink.focus();
      }
    },
    async exportComments() {
      const selectedCommentIds = this.selectedComments();
      await this.$store.dispatch("documentFeedbacks/exportComments", {
        commentIds: selectedCommentIds,
        caller: this,
      });
      this.selectAllOption = false;
      // Eventually we should add the export to existing export process as done
      // by folders/search etc.
      const anchor = document.createElement("a");
      anchor.href =
        "data:text/csv;charset=utf-8," + encodeURIComponent(this.exportData);
      anchor.target = "_blank";
      anchor.download = `feedback_comments_${this.$moment().format(
        "YYYYMMDD-HHmmss"
      )}.csv`;
      anchor.click();
    },
    enableExportComments() {
      this.displaySelectAll = false;
      this.exportEnabled = true;
      this.showChangeStatus = false;
      this.showCancelButton = true;
      this.showDocumentSelectionCheckboxes = true;
    },
    cancelActions() {
      this.showDocumentSelectionCheckboxes = false;
      this.exportEnabled = false;
      this.showChangeStatus = false;
      this.showCancelButton = false;
      this.selectAllOption = false;
      this.unSelectAllComments();
    },
    changeStatus() {
      this.exportEnabled = false;
      this.showChangeStatus = true;
      this.showDocumentSelectionCheckboxes = true;
      this.exportEnabled = false;
      this.showCancelButton = true;
      this.displaySelectAll = true;
      this.$nextTick(() => {
        const selectAllCheckbox = document.querySelector("#selectAllCheckbox");
        if (selectAllCheckbox) {
          selectAllCheckbox.focus();
        }
      });
    },
    toggleSelectAll() {
      // uncheck all checkboxes if already checked or vice versa
      this.feedbacks.forEach((feedback) => {
        feedback.document.selected = feedback.document.selected ? false : true;
      });
    },
    unSelectAllComments() {
      // uncheck all checkboxes
      this.feedbacks.forEach((feedback) => {
        feedback.document.selected = false;
      });
    },
    loadFeedbacks() {
      this.$store
        .dispatch("documentFeedbacks/retrieveFeedbacks", {
          caller: this,
        })
        .then(() => {
          this.$announcer.set("showing document feedbacks");
          const changeStatusLink = document.querySelector("#changeStatusLink");
          if (changeStatusLink) {
            changeStatusLink.focus();
          }
        });
    },
    searchFeedbacks() {
      this.$store
        .dispatch("documentFeedbacks/search", {
          caller: this,
        })
        .then(() => {
          this.$announcer.set("displaying document feedback search results");
          this.$bus.$emit("searchPerformed");
        });
    },
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.page = pageNum;
      query.status_filter = this.searchCriteria.searchfor.status;
      return {
        name: this.$route.name,
        query: query,
      };
    },
    updateStatus() {
      const selectedCommentIds = this.selectedComments();
      this.$store.dispatch("documentFeedbacks/updateStatus", {
        commentIds: selectedCommentIds,
        status: this.selectedStatus,
        caller: this,
      });
      this.toggleSelectAll();
      this.selectAllOption = false;
      this.selectedStatus = null;
    },
    selectedComments() {
      return this.feedbacks.reduce(function (selectedComments, feedback) {
        if (feedback.document.selected) {
          selectedComments = selectedComments.concat(feedback.id);
        }
        return selectedComments;
      }, []);
    },
  },
};
</script>

<style scoped lang="scss">
.sorry-text {
  font-size: $font-size-7;
}
</style>
