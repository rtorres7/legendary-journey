<template>
  <div class="mt-6 standard-page-margin">
    <div v-if="hasError">
      <NotFound />
    </div>
    <div v-else>
      <vanity-title class="mb-6" title="Background Jobs" />
      <b-row>
        <b-tabs class="mb-6" v-model="tabIndex">
          <template v-for="(tab, idx) in tabs">
            <b-tab :title="tab" @click="changeTab(idx)" :key="tab" />
          </template>
        </b-tabs>
      </b-row>

      <b-row class="d-flex align-items-center">
        <b-col cols="8" md="7" lg="6" xl="5">
          <b-form-group
            label="Per Page"
            label-for="per-page-select"
            label-cols="6"
            label-align="right"
            class="mb-0 text-nowrap"
          >
            <b-form-select
              @change="handlePageCountChange"
              id="per-page-select"
              v-model="perPageCount"
              :options="[10, 25, 50, 100]"
              size="sm"
              class="w-50"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="d-flex justify-content-end pr-4" v-if="tabIndex === 2">
          <b-btn
            class="mr-2"
            variant="primary"
            @click="requeueAllFailedJobs"
            :disabled="items.length === 0"
            >Re-Queue All Failed</b-btn
          >
        </b-col>
      </b-row>
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>
      <b-container class="mt-6" fluid v-else>
        <b-table
          hover
          headVariant="light"
          no-local-sorting
          no-sort-reset
          show-empty
          :items="items"
          :fields="fields"
        >
          <template #head()="data">
            <span class="table-header">{{ data.label }}</span>
          </template>
          <template #cell(job_admin_links)="data">
            <span class="text-nowrap" v-html="getCellValue(data)" />
          </template>
          <template #cell()="data">
            <span v-html="getCellValue(data)" />
          </template>
        </b-table>
        <div class="overflow-auto text-center mt-5 pb-6" v-if="pages > 1">
          <div class="d-flex justify-content-center">
            <b-pagination-nav
              :link-gen="paginationLink"
              :number-of-pages="this.pages"
              @change="loadBackgroundJobs"
              v-model="currentPageNum"
            ></b-pagination-nav>
          </div>
        </div>
        <b-row> </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import NotFound from "@shared/errors/NotFound";
import Spinner from "@shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import axios from "axios";

export default {
  name: "BackgroundJobs",
  components: {
    VanityTitle,
    Spinner,
    NotFound,
  },
  data() {
    return {
      loading: true,
      tabs: ["Pending", "Active", "Failed"],
      currentPage: 1,
      pages: 1,
      perPageCount: 10,
      tabIndex: parseInt(this.$route.query.tabIndex) || 0,
      fields: [
        { key: "id", label: "Job" },
        { key: "created_at", label: "Created At", isDate: true },
        { key: "description", label: "Handler", class: "word-break" },
        { key: "root_cause", label: "Error", class: "word-break" },
        { key: "document", label: "Document" },
        { key: "priority", label: "Priority" },
        { key: "attempts", label: "Attempts" },
        { key: "locked_by", label: "Locked By" },
        { key: "locked_at", label: "Locked At", isDate: true },
        { key: "run_at", label: "Scheduled", isDate: true },
        { key: "failed_at", label: "Failed At", isDate: true },
        { key: "job_admin_links", label: "" },
      ],
      items: [],
      hasError: null,
    };
  },
  computed: {
    tabStatus() {
      return this.tabs[this.tabIndex].split(" ")[0];
    },
  },
  mounted() {
    this.loadBackgroundJobs();
  },
  methods: {
    setQueryParams(pageNum) {
      this.$router
        .push({
          query: {
            tabIndex: this.tabIndex,
            page: pageNum || this.$route.query.page || 1,
          },
        })
        .catch(() => {});
    },
    loadBackgroundJobs(pageNum) {
      this.setQueryParams(pageNum);
      this.loading = true;
      axios
        .get("/admin/jobs", {
          params: {
            page: this.$route.query.page,
            status: this.tabStatus,
            perPageCount: this.perPageCount,
          },
        })
        .then((response) => {
          this.hasError = false;
          this.items = response.data.data;
          this.pages = response.data.pageCount;
          this.currentPageNum = response.data.currentPageNum;
          this.loading = false;
          this.tabs = response.data.tabs;
        })
        .catch(() => {
          this.hasError = true;
        });
    },
    requeueAllFailedJobs() {
      axios
        .post("/admin/jobs/requeue_all")
        .then((response) => {
          this.$wireNotification({
            title: "Requeued All Failed",
            duration: 5000,
            text: "All failed jobs have been requeued",
            type: "success",
          });
          this.tabs = response.data.tabs;
          this.changeTab(0);
        })
        .catch((err) => {
          this.$wireNotification({
            type: "error",
            title: "Error processing request",
            text: "Error requeuing all failed jobs.",
          });
        });
    },
    getCellValue(data) {
      if (data.field.isDate) {
        return this.formatDate(data.value);
      } else {
        return data.value;
      }
    },
    formatDate(dateStr) {
      var date = this.$moment(dateStr, "YYYY/MM/DD hh:mm:ss ZZ");
      return date.isValid() ? date.format("YYYY-MM-DD HH:mm") : dateStr;
    },
    handlePageCountChange(count) {
      this.perPageCount = count;
      this.loadBackgroundJobs(1);
    },
    changeTab(tabIndex) {
      this.tabIndex = tabIndex;
      this.loadBackgroundJobs(1);
    },
    paginationLink(pageNum) {
      return {
        query: { page: pageNum },
      };
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep label.col-form-label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}

::v-deep table a {
  padding: 4px;
}
::v-deep .word-break {
  word-break: break-all;
}
</style>
