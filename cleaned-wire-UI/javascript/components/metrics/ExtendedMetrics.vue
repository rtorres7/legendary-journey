<template>
  <div>
    <Spinner v-if="loading" size="32" />
    <div v-else>
      <slot name="metricsSummary"></slot>

      <b-row align-h="end">
        <b-col class="my-3">
          <a
            :href="`${linkPath}/metrics/extended.csv?${csvParams}`"
            _temp_576="_blank"
            >View Raw Numbers</a
          ></b-col
        >
        <b-form-group class="_temp_369-compact-selector">
          <b-dropdown variant="link" :text="'View by ' + grouping">
            <b-dropdown-item
              v-for="option in DATE_GROUPINGS"
              @click="dateGrouping = option"
              :key="option"
            >
              {{ option }}
            </b-dropdown-item>
          </b-dropdown>

          <b-form-radio-group
            class="pr-2"
            v-model="chartType"
            buttons
            size="sm"
            :options="chartTypeOpts"
            button-variant="outline-dark"
          >
          </b-form-radio-group>
        </b-form-group>
      </b-row>

      <MetricsByCategoryChart
        :chartTitle="`Unique Readers Per ${grouping}, by Market Segment`"
        :chartData="readersByCategory"
        :chartType="chartType"
      />

      <MetricsByCategoryChart
        :chartTitle="`Views Per ${grouping}, by Market Segment`"
        :chartData="viewsByCategory"
        :chartType="chartType"
      />

      <ReadersByOrg :data="readersByOrg" />
    </div>
  </div>
</template>

<script>
import MetricsByCategoryChart from "./MetricsByCategoryChart";
import ReadersByOrg from "./ReadersByOrg";
import Spinner from "@shared/Spinner";
import axios from "axios";
import { capitalize, forEach, join } from "lodash";

export default {
  name: "ExtendedMetrics",
  components: {
    MetricsByCategoryChart,
    ReadersByOrg,
    Spinner,
  },
  data() {
    return {
      chartType: "column",
      DATE_GROUPINGS: ["day", "week", "month", "year"],
      dateGrouping: "year",
      chartTypeOpts: [
        { text: "Bar", value: "column" },
        { text: "Line", value: "line" },
      ],

      readersByOrg: [],
      readersByCategory: [],
      viewsByCategory: [],
      loading: false,
    };
  },
  props: {
    readershipStartDate: {
      type: String,
    },
    readershipEndDate: {
      type: String,
    },
  },
  mounted() {
    this.retrieveMetrics();
  },
  computed: {
    linkPath() {
      return this.$route.name === "search"
        ? `/search`
        : `/documents/${this.$route.params.docNum}`;
    },
    csvParams() {
      let metricsParams = this.queryParams;
      metricsParams["metrics_id"] = "extended";
      return this.formattedQueryString(metricsParams);
    },
    query() {
      return this.$route.query;
    },
    grouping() {
      return capitalize(this.dateGrouping);
    },
    queryParams() {
      let queryParams = Object.assign({}, this.query);
      // remove the query params we don't want to display
      delete queryParams["id"];
      delete queryParams["page"];
      delete queryParams["view"];

      queryParams["readership_start_date"] = this.readershipStartDate;
      queryParams["readership_end_date"] = this.readershipEndDate;
      queryParams["grouping"] = this.dateGrouping;

      return queryParams;
    },
  },
  methods: {
    dateRangeUpdated(startDate, endDate) {
      let metricsParams = this.queryParams;
      metricsParams["readership_start_date"] = startDate;
      metricsParams["readership_end_date"] = endDate;

      this.retrieveMetrics(metricsParams);
    },
    formattedQueryString(params) {
      let paramsArray = [];
      forEach(params, (value, query) => {
        if (Array.isArray(value)) {
          forEach(value, (v) => {
            paramsArray.push(query + "=" + v);
          });
        } else {
          if (value !== "") {
            paramsArray.push(query + "=" + value);
          }
        }
      });

      return join(paramsArray, "&");
    },
    async retrieveReadersByOrg(params) {
      const response = await axios.get(
        this.linkPath + "/metrics/readers_by_derived_org.json?" + params
      );

      this.readersByOrg = response.data.data;
    },

    async retrieveReadersByCategory(params) {
      const response = await axios.get(
        this.linkPath + "/metrics/readers_by_category.json?" + params
      );
      this.readersByCategory = response.data;
    },
    async retrieveViewsByCategory(params) {
      const response = await axios.get(
        this.linkPath + "/metrics/views_by_category.json?" + params
      );
      this.viewsByCategory = response.data;
    },
    retrieveMetrics() {
      this.loading = true;
      let params = this.formattedQueryString(this.queryParams);
      Promise.all([
        this.retrieveReadersByOrg(params),
        this.retrieveReadersByCategory(params),
        this.retrieveViewsByCategory(params),
      ])
        .then((_results) => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    queryParams() {
      this.retrieveMetrics();
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .btn,
.btn:focus {
  border-radius: unset;
}
.btn-group {
  padding-left: 2rem;
}
.form-group {
  margin: 0;
}
/deep/ .b-calendar {
  background-color: $pri-800;
}
</style>
