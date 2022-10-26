<template>
  <div>
    <div v-if="hasError">
      <NotFound />
    </div>
    <div class="mt-6 standard-page-margin" v-else>
      <vanity-title class="mb-6" :title="`Job Details for Job ID ${jobId}`" />
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>
      <b-container v-else fluid class="mt-4 mb-8">
        <div class="text-right ml-auto">
          <DeleteButton
            v-if="job.status !== 'Active'"
            :useIcon="false"
            :_temp_1="`/admin/jobs/${job.id}`"
            :label="`Job ${job.id}`"
            type="Job"
            :caller="this"
            class="mr-4"
          />

          <b-btn
            :href="`/admin/ingest/${job.id}/download_file`"
            target="_blank"
            _temp_20="button"
            class="btn-link mr-4"
            v-if="job.downloadable"
          >
            Download
          </b-btn>

          <b-btn
            class="mr-4"
            variant="primary"
            @click="requeueJob"
            v-if="job.status === 'Failed'"
            >Requeue</b-btn
          >
        </div>

        <b-card>
          <div class="row mt-4">
            <b-col>
              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Status</b-col
                >
                <b-col :class="`status ${jobStatusClass}`">
                  <strong>{{ job.status }}</strong>
                </b-col>
              </b-row>
              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label">Queue</b-col>
                <b-col class="queue">{{ job.queue }}</b-col>
              </b-row>

              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Priority</b-col
                >
                <b-col class="priority">{{ job.priority }}</b-col>
              </b-row>

              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Attempts</b-col
                >
                <b-col class="attempts">{{ job.attempts }}</b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Created At</b-col
                >
                <b-col class="created_at">{{
                  formatDate(job.created_at)
                }}</b-col>
              </b-row>

              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Scheduled Run At</b-col
                >
                <b-col class="run_at">{{ formatDate(job.run_at) }}</b-col>
              </b-row>

              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Updated At</b-col
                >
                <b-col class="updated_at">{{
                  formatDate(job.updated_at)
                }}</b-col>
              </b-row>

              <b-row class="pb-3">
                <b-col cols="11" md="9" lg="7" class="field-label"
                  >Failed At</b-col
                >
                <b-col class="failed_at">{{ formatDate(job.failed_at) }}</b-col>
              </b-row>
            </b-col>
          </div>

          <hr />

          <b-row class="pb-3">
            <b-col cols="5" lg="3" class="field-label">Method/Object</b-col>
            <b-col class="handler">{{ job.description }}</b-col>
          </b-row>

          <b-row class="pb-3">
            <b-col cols="5" lg="3" class="field-label">Arguments</b-col>
            <b-col class="arguments">{{ job.job_arguments }}</b-col>
          </b-row>

          <b-row class="pb-3">
            <b-col cols="5" lg="3" class="field-label">Locked By</b-col>
            <b-col class="locked_by">{{ job.locked_by }}</b-col>
          </b-row>

          <b-row class="pb-3" v-if="job.root_cause">
            <b-col cols="5" lg="3" class="field-label">Root Cause</b-col>
            <b-col cols="18" class="border rounded bg-light p-3 error-message">
              <pre>{{ job.root_cause }}</pre>
            </b-col>
          </b-row>

          <hr v-if="job.last_error" />

          <b-row class="pb-3" v-if="job.last_error">
            <b-col cols="5" lg="3" class="field-label">Full Backtrace</b-col>
            <b-col cols="18" class="error-message">
              <pre>{{ job.last_error }}</pre>
            </b-col>
          </b-row>
        </b-card>
      </b-container>
    </div>
  </div>
</template>

<script>
import DeleteButton from "@shared/DeleteButton";
import NotFound from "@shared/errors/NotFound";
import Spinner from "@shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import axios from "axios";

export default {
  name: "BackgroundJob",
  components: {
    DeleteButton,
    VanityTitle,
    Spinner,
    NotFound,
  },
  props: ["backgroundJob"],
  data() {
    return {
      job: {},
      hasError: false,
      loading: false,
    };
  },
  mounted() {
    this.loadBackgroundJob();
  },
  computed: {
    jobId() {
      return this.$route.params.id;
    },
    jobStatusClass() {
      switch (this.job.status) {
        case "Failed":
          return "text-danger";
        case "Pending":
          return "text-warning";
        case "Active":
          return "text-success";
        default:
          return "text-info";
      }
    },
  },
  methods: {
    loadBackgroundJob() {
      this.loading = true;
      axios
        .get(`/admin/jobs/${this.jobId}.json`)
        .then((response) => {
          this.hasError = false;
          this.job = response.data.job;
          this.loading = false;
        })
        .catch(() => {
          this.hasError = true;
          this.loading = false;
        });
    },
    requeueJob() {
      axios
        .post(`/admin/jobs/${this.job.id}/requeue`)
        .then((response) => {
          this.$wireNotification({
            title: `Job ${this.job.id} Requeued`,
            duration: 5000,
            text: `Job ${this.job.id}} has been requeued`,
            type: "success",
          });
          this.$router.push({
            name: "backgroundJobs",
          });
        })
        .catch((err) => {
          this.$wireNotification({
            title: `Requeuing Job Failed`,
            duration: 5000,
            text: `Failed to requeue Job ${this.job.id}.`,
            type: "error",
          });
        });
    },
    formatDate(dateStr) {
      if (dateStr) {
        var date = this.$moment(dateStr, "YYYY/MM/DD hh:mm:ss ZZ");
        return date.isValid() ? date.format("llll") : dateStr;
      } else {
        return dateStr;
      }
    },
    deleted() {
      this.$wireNotification({
        title: `Job ${this.job.id} Deleted`,
        duration: 5000,
        text: `Job ${this.job.id}} has been deleted`,
        type: "success",
      });
      this.$router.push({
        name: "backgroundJobs",
      });
    },
    deletionFailed() {
      this.$wireNotification({
        title: `Deleting Job Failed`,
        duration: 5000,
        text: `Failed to delete Job ${this.job.id}.`,
        type: "error",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.field-label {
  color: $alt-800;
  text-transform: uppercase;
  margin-right: 1rem;
}

.error-message {
  word-wrap: break-all;
  width: 750px;
}

::v-deep .btn-link {
  padding: 0.375rem 0.75rem !important;
  background-color: $alt-300;
  border-color: $alt-500;
}
</style>
