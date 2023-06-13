<template>
  <div class="pt-8" v-if="!user.loading && !restricted">
    <b-row class="pri-800 separator pb-2">
      <b-col><h2 class="pri-800">Metrics</h2></b-col>
      <b-col class="text-right"
        ><b-button
          class="pr-0"
          v-b-modal.document-metrics-modal
          variant="link"
          aria-label="more"
        >
          [more]
        </b-button>
      </b-col>
      <b-modal
        id="document-metrics-modal"
        size="xl"
        hide-footer
        title-class="modal-header-title"
      >
        <template #modal-header="{ close }"
          ><h2 class="modal-header-title" v-html="document.display_title"></h2>
          <button
            type="button"
            aria-label="Close"
            class="close"
            @click="close()"
          >
            ×
          </button></template
        >
        <ExtendedMetrics
          :readershipStartDate="readershipStartDate"
          :readershipEndDate="readershipEndDate"
        >
          <template slot="metricsSummary">
            <DocumentMetricsSummary
              :document="document"
              :queryParams="queryParams"
            />
          </template>
        </ExtendedMetrics>
      </b-modal>
    </b-row>
    <Spinner v-if="metricsLoading" size="32" />
    <div v-else>
      <b-row class="pt-4" v-if="!metricsLoading">
        <b-col class="text-nowrap"
          ><h3>Unique Readers ({{ uniqueReaders }})</h3>
        </b-col>
        <b-col class="text-right">
          <img
            tabindex="0"
            id="metrics-help"
            :src="require('@assets/help-icon.svg')"
            class="help-icon mr-1"
            alt="metrics help"
          />

          <b-tooltip target="metrics-help" placement="left">
            Readership is defined as {{ chartDescription }}.
            {{ name }} periodically updates its customer segmentation profile to
            reflect the diversity of our _temp_536 consumers. It was last
            updated on 1 Dec 2015.</b-tooltip
          >
        </b-col>
      </b-row>
      <b-row class="pt-4">
        <b-col cols="24">
          <DateRangePicker
            :minDate="document.display_date"
            :startDate="readershipStartDate"
            :endDate="readershipEndDate"
            @dateRangeUpdated="dateRangeUpdated"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="24">
          <MetricsByCategoryChart
            :chartData="readership"
            chartType="pie"
            :description="`This chart displays the number of ${chartDescription}.`"
          />
          <div class="sr-only">
            Contact {{ agency }} {{ name }} for access to these metrics reports
            at {{ contactEmail }}.
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "../metrics/DateRangePicker";
import DocumentMetricsSummary from "../metrics/DocumentMetricsSummary";
import ExtendedMetrics from "../metrics/ExtendedMetrics";
import MetricsByCategoryChart from "../metrics/MetricsByCategoryChart";
import Spinner from "@shared/Spinner";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "DocumentMetrics",
  components: {
    DateRangePicker,
    DocumentMetricsSummary,
    ExtendedMetrics,
    MetricsByCategoryChart,
    Spinner,
  },
  data() {
    return {
      readershipStartDate: "",
      readershipEndDate: "",
      uniqueReaders: 0,
      readership: [],
      metricsLoading: true,
    };
  },
  mounted() {
    this.initDates();
    if (!this.user.loading && !this.restricted) {
      this.retrieveMetrics();
    }
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("metadata", ["agency", "contactEmail", "name"]),
    ...mapState("user", ["user", "loading"]),
    restricted() {
      return this.user.congress;
    },
    queryParams() {
      let params = {};
      params["readership_start_date"] = this.readershipStartDate;
      params["readership_end_date"] = this.readershipEndDate;
      return params;
    },
    chartDescription() {
      return (
        "unique users who accessed this product between the publication date (" +
        this.formatDate(this.document.display_date) +
        ") and today"
      );
    },
  },
  methods: {
    initDates() {
      this.readershipStartDate = this.document.display_date;
      this.readershipEndDate = this.$moment().format("YYYY-MM-DD");
    },
    dateRangeUpdated(startDate, endDate) {
      this.readershipStartDate = startDate;
      this.readershipEndDate = endDate;
      this.retrieveMetrics();
    },
    retrieveMetrics() {
      this.metricsLoading = true;
      axios
        .get(
          `/documents/${this.$route.params["docNum"]}/metrics/basic_metrics.json`,
          {
            params: this.queryParams,
          }
        )
        .then((response) => {
          this.uniqueReaders = response.data.metrics["uniqueReadership"];
          this.readership = response.data.metrics["readership"];
          this.metricsLoading = false;
        })
        .catch(() => {
          this.metricsLoading = false;
        });
    },
    formatDate(date) {
      return this.$moment(date).format("DD MMM YYYY");
    },
  },
  watch: {
    document() {
      this.initDates();
      this.retrieveMetrics();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}
.help-icon {
  height: 16px;
  width: 16px;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
