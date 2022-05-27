<template>
  <div v-if="canUseMetrics">
    <b-button
      v-b-modal.search-metrics-modal
      class="py-0 d-inline-flex search-action"
      variant="link"
    >
      <WireBackgroundAsset
        class="pill-row-icon my-auto"
        imageName="stats.svg"
        fill
      />
      <div class="pill-button-text">Metrics</div>
    </b-button>

    <b-modal
      id="search-metrics-modal"
      ref="search-metrics-modal"
      size="lg"
      hide-footer
    >
      <template #modal-title> {{ name }} Search {{ modalTitle }} </template>
      <ExtendedMetrics
        :readershipStartDate="readershipStartDate"
        :readershipEndDate="readershipEndDate"
      >
        <template slot="metricsSummary">
          <SearchMetricsSummary
            :queryParams="queryParams"
            @dateRangeUpdated="setReadershipDateRange"
          />
        </template>
      </ExtendedMetrics>
    </b-modal>
  </div>
</template>

<script>
import ExtendedMetrics from "../../metrics/ExtendedMetrics";
import SearchMetricsSummary from "../../metrics/SearchMetricsSummary";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import { capitalize, isEmpty, map, size } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  name: "SearchMetrics",
  components: { ExtendedMetrics, SearchMetricsSummary, WireBackgroundAsset },
  data() {
    return {
      today: "",
      readershipStartDate: "",
      readershipEndDate: "",
    };
  },
  mounted() {
    this.today = this.$moment().format("YYYY-MM-DD");
    this.setReadershipDateRange(this.startDate, this.endDate);
  },
  computed: {
    ...mapState("metadata", ["name"]),
    ...mapGetters("user", ["canUseMetrics"]),
    startDate() {
      if (!isEmpty(this.$route.query.start_date))
        return this.$route.query.start_date;
    },
    endDate() {
      return !isEmpty(this.$route.query.end_date)
        ? this.$route.query.end_date
        : this.today;
    },
    queryParams() {
      let params = this.filteredParams();

      // set the readership date range
      params["readership_start_date"] = this.readershipStartDate;
      params["readership_end_date"] = this.readershipEndDate;

      return params;
    },
    modalTitle() {
      let query = this.filteredParams();

      if (isEmpty(query["end_date"]) || query["end_date"] === this.today) {
        delete query["end_date"];
      }

      let separator = size(query) > 0 ? " - " : "";
      let searchDetails = map(query, (value, paramName) => {
        return this.titleCase(paramName.replace("[]", "")) + ": " + value;
      });

      return separator + searchDetails.sort().reverse().join(" / ");
    },
  },
  methods: {
    filteredParams() {
      let query = Object.assign({}, this.$route.query);

      // remove the query params we don't want to include
      delete query["id"];
      delete query["page"];
      delete query["view"];

      return query;
    },
    titleCase(value) {
      return map(value.split("_"), capitalize).join(" ");
    },
    setReadershipDateRange(startDate, endDate) {
      // use date range selected from the datepicker
      this.readershipStartDate = startDate;
      this.readershipEndDate = endDate;
    },
  },
  watch: {
    $route() {
      // if search date range changes, update the readership date range
      this.setReadershipDateRange(this.startDate, this.endDate);
    },
  },
};
</script>
