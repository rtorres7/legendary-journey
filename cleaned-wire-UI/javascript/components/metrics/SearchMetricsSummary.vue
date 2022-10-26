<template>
  <div>
    <b-row class="py-2">
      <b-col class="text-nowrap">
        <a :href="linkPath" target="_blank">
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
        <span>{{ searchDateRange }}</span>
      </b-col>
    </b-row>
    <b-row class="pb-5">
      <b-col class="text-nowrap">
        <DateRangePicker
          showLabel
          :minDate="queryParams.start_date"
          :startDate="queryParams.readership_start_date"
          :endDate="queryParams.readership_end_date"
          @dateRangeUpdated="dateRangeUpdated"
        />
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
import DateRangePicker from "./DateRangePicker";
import axios from "axios";
import { forEach, join } from "lodash";

export default {
  name: "SearchMetricsSummary",
  components: {
    DateRangePicker,
  },
  data() {
    return {
      queryLimit: 10000,
      searchTotal: 0,
      uniqueReaders: 0,
      totalViews: 0,
    };
  },
  props: {
    queryParams: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    let paramsToUse = this.formattedQueryString(this.queryParams);
    this.retrieveMetrics(paramsToUse);
  },
  computed: {
    linkPath() {
      return `/search${location.search}`;
    },
    searchDateRange() {
      let startDate = this.queryParams.start_date
        ? this.formatDateTime(this.queryParams.start_date)
        : "";
      let endDate = this.formatDateTime(this.queryParams.end_date);

      return `${startDate} Through ${endDate}`;
    },
  },
  methods: {
    dateRangeUpdated(startDate, endDate) {
      this.$emit("dateRangeUpdated", startDate, endDate);
    },
    formattedQueryString(params) {
      let paramsArray = [];
      forEach(params, (value, query) => {
        if (Array.isArray(value)) {
          forEach(value, (v) => {
            paramsArray.push(query + "=" + v);
          });
        } else {
          paramsArray.push(query + "=" + value);
        }
      });

      return join(paramsArray, "&");
    },
    retrieveMetrics(params) {
      axios
        .get("/search/metrics/search_total.json?" + params)
        .then((response) => {
          this.searchTotal = response.data;
        });
      axios
        .get("/search/metrics/total_views.json?" + params)
        .then((response) => {
          this.totalViews = response.data;
        });
      axios
        .get("/search/metrics/unique_readership.json?" + params)
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
};
</script>

<style scoped lang="scss">
.metrics-label {
  font-weight: bold;
}
</style>
