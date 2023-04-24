<template>
  <div class="mt-6 standard-page-margin">
    <div v-if="hasError">
      <NotFound />
    </div>
    <div v-else>
      <vanity-title title="System Feedback" />
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>
      <div v-else>
        <div class="d-flex justify-content-end pr-8 mt-6 mb-4">
          <b-form-checkbox
            id="pending-filter"
            @change="loadFiltered"
            v-model="pendingFilter"
            >Filter on Pending</b-form-checkbox
          >
        </div>
        <b-table
          hover
          aria-label="Review System Feedback"
          tabindex="0"
          headVariant="light"
          :items="feedbackItems"
          :fields="fields"
          @row-clicked="handleRowClick"
          tbody-tr-class="selectable"
        >
          <template #head()="data">
            <span class="table-header">{{ data.label }}</span>
          </template>
          <template #cell(datePosted)="data">
            {{ formatTimeStamp(data.item.createdAt) }}
          </template>
          <template #cell(body)="data">
            {{ truncate(data.item.body, 30) }}
          </template>
          <template #cell(state)="data">
            {{ feedbackState(data.item) }}
          </template>
          <template #cell()="data">
            {{ data.value }}
          </template>
        </b-table>
        <div class="overflow-auto text-center mt-5 pb-6" v-if="pages > 1">
          <div class="d-flex justify-content-center">
            <b-pagination-nav
              :link-gen="paginationLink"
              :number-of-pages="this.pages"
              @change="loadFeedback"
              v-model="currentPageNum"
            ></b-pagination-nav>
          </div>
        </div>
      </div>
      <SystemFeedbackModal
        @feedback-update="updateFeedback"
        :updateAccess="userPermittedToUpdate"
        :feedbackUsers="feedbackUsers"
      />
    </div>
  </div>
</template>

<script>
import NotFound from "@shared/errors/NotFound";
import Spinner from "@shared/Spinner";
import SystemFeedbackModal from "./SystemFeedbackModal";
import VanityTitle from "../../vanity/VanityTitle";
import axios from "axios";
import { capitalize } from "lodash";

export default {
  name: "SystemFeedback",
  components: {
    NotFound,
    Spinner,
    SystemFeedbackModal,
    VanityTitle,
  },
  data() {
    return {
      pendingFilter: false,
      feedbackItems: [],
      feedbackUsers: [],
      pages: 1,
      currentPage: 1,
      loading: true,
      selected: null,
      saveIndex: null,
      fields: [
        { key: "id", label: "ID" },
        { key: "classification", label: "Classification" },
        { key: "body", label: "Message" },
        { key: "name", label: "Posted By" },
        { key: "datePosted", label: "Date Posted" },
        { key: "state", label: "Status" },
      ],
      userPermittedToUpdate: false,
      hasError: null,
      focusSet: false,
    };
  },
  mounted() {
    this.loadFeedback();
  },
  updated() {
    if (!this.focusSet) {
      const feedbackTableRef = document.querySelector("#pending-filter");
      if (feedbackTableRef) {
        feedbackTableRef.focus();
      }
      this.focusSet = true;
    }
  },
  computed: {},
  methods: {
    loadFiltered() {
      this.saveIndex = 0;
      this.loadFeedback(1);
    },
    loadFeedback(pageNum) {
      this.loading = true;
      axios
        .get("/system_feedback/", {
          params: {
            page: pageNum || this.$route.query.page || 1,
            pending_filter: this.pendingFilter,
          },
        })
        .then((response) => {
          this.hasError = false;
          this.feedbackItems = response.data.feedbackItems;
          this.feedbackUsers = response.data.feedbackUsers;
          this.pages = response.data.pageCount;
          this.currentPageNum = response.data.currentPageNum;
          this.userPermittedToUpdate = response.data.permittedToUpdate;
          this.loading = false;
          this.$nextTick(() => {
            if (this.saveIndex != null) {
              document.querySelectorAll(".selectable")[this.saveIndex].focus();
            }
          });
        })
        .catch((e) => {
          this.hasError = true;
        });
    },
    handleRowClick(feedback, index) {
      this.saveIndex = index;
      this.selected = feedback;
      this.$bus.$emit("show-systemfeedback-modal", feedback);
    },
    updateFeedback(updateInfo) {
      axios
        .patch("/system_feedback/" + updateInfo.id, {
          commit: updateInfo.commit,
          assigned_to: updateInfo.assignedTo,
          referred_to: updateInfo.referredTo,
        })
        .then(() => {
          this.$wireNotification({
            title: "System Feedback Updated",
            duration: 5000,
            text: `System Feedback ${this.selected.id} has been updated`,
            type: "success",
          });
          this.loadFeedback();
        })
        .catch(() => {
          this.$wireNotification({
            title: "System Alert",
            duration: 5000,
            text: "Unable to transition system feedback.",
            type: "error",
          });
        });
    },
    formatTimeStamp(dateTime) {
      return this.$moment(dateTime, "YYYY/MM/DD hh:mm:ss ZZ").format(
        "YYYY-MM-DD HH:mm"
      );
    },
    paginationLink(pageNum) {
      return {
        query: { page: pageNum },
      };
    },
    feedbackState(item) {
      return capitalize(item.state);
    },
    truncate(str, max) {
      if (str && str.length > max) {
        return str.slice(0, max) + "...";
      } else {
        return str;
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .selectable {
  cursor: pointer;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
::v-deep tr {
  &:focus {
    background-color: $alt-300;
  }
}
</style>
