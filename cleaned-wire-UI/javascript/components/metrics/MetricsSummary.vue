<template>
  <div>
    <b-row class="py-2">
      <b-col class="text-nowrap">
        <a :href="linkPath" _temp_576="_blank">
          <i class="fa fa-search fa-fw"></i> Run This Search
        </a>
      </b-col>
      <b-col class="text-nowrap">
        <span class="metrics-label">Search Results: </span
        >{{ formatNumber(searchTotal) }}
      </b-col>
      <b-col class="text-nowrap">
        <span class="metrics-label">Unique Readers: </span
        >{{ formatNumber(uniqueReaders) }}
      </b-col>
      <b-col class="text-nowrap">
        <span class="metrics-label">Total Views: </span
        >{{ formatNumber(totalViews) }}
      </b-col>
    </b-row>
    <b-row class="text-center pb-5">
      <b-col>
        <span class="metrics-label">Search Date Range: </span>
        <span
          >{{ startDate ? formatDateTime(startDate) : "" }} Through
          {{ formatDateTime(endDate) }}</span
        >
      </b-col>
    </b-row>
    <b-row class="pb-5">
      <b-col class="d-flex align-items-center ml-auto text-nowrap" cols="24">
        <span class="metrics-label">Readership Date Range: </span>
        <b-form-datepicker
          v-model="readershipStartDate"
          class="w-50 ml-2"
          :min="startDate"
          :max="today"
          placeholder="Select start date"
        ></b-form-datepicker>
        <b-form-datepicker
          v-model="readershipEndDate"
          class="w-50 ml-2"
          :min="startDate"
          :max="today"
          placeholder="Select end date"
        ></b-form-datepicker>
      </b-col>
      <b-col cols="24" class="py-4" v-if="(searchTotal || 0) > queryLimit">
        <span class="metrics-label">Note: </span>
        The search returned {{ formatNumber(searchTotal) }} results. This
        metrics report is limited to data for the first
        {{ formatNumber(queryLimit) }} results.
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MetricsSummary",
  data() {
    return {
      queryLimit: 10000,
      today: "",
      readershipStartDate: "",
      readershipEndDate: "",
      searchTotal: 0,
      uniqueReaders: 0,
      totalViews: 0,
    };
  },
  mounted() {
    this.today = new Date();
    // defaults to search date
    this.readershipStartDate = this.startDate;
    this.readershipEndDate = this.endDate;
    this.retrieveMetrics();
  },
  computed: {
    linkPath() {
      return `/search${location.search}`;
    },
    startDate() {
      if (this.$route.query) return this.$route.query.start_date;
    },
    endDate() {
      return this.$route.query ? this.$route.query.end_date : this.today;
    },
    query() {
      return this.$route.query;
    },
  },
  methods: {
    retrieveMetrics() {
      let queryParams = Object.assign({}, this.query);
      // remove the query params we don't want to display
      delete queryParams["id"];
      delete queryParams["page"];
      delete queryParams["view"];

      axios
        .get("/search/metrics/search_total.json", {
          params: queryParams,
        })
        .then((response) => {
          this.searchTotal = response.data;
        });
      axios
        .get("/search/metrics/total_views.json", {
          params: queryParams,
        })
        .then((response) => {
          this.totalViews = response.data;
        });
      axios
        .get("/search/metrics/unique_readership.json", {
          params: queryParams,
        })
        .then((response) => {
          this.uniqueReaders = response.data;
        });
    },
    formatDateTime(dateTime) {
      return this.$moment(dateTime).format("D MMMM YYYY");
    },
    formatNumber: function (itemVal) {
      return itemVal ? itemVal.toLocaleString() : 0;
    },
  },
  watch: {
    query() {
      this.retrieveMetrics();
    },
  },
};
</script>

<style scoped>
.search-icon {
  height: 24px;
  width: 24px;
}
.metrics-label {
  font-weight: bold;
}
</style>
