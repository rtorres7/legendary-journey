<template>
  <div>
    <b-row class="py-2">
      <b-col class="text-nowrap">
        <a :href="linkPath" _temp_576="_blank">
          {{ document.documentNumber }}
        </a>
      </b-col>
      <b-col class="text-nowrap">
        <span class="metrics-label">Publication Date:</span
        >{{ formatDateTime(document.publicationDate) }}
      </b-col>
      <b-col class="text-nowrap text-right">
        <span class="metrics-label">Unique Readers:</span
        >{{ formatNumber(uniqueReaders) }}
      </b-col>
      <b-col class="text-nowrap text-right">
        <span class="metrics-label">Total Views:</span
        >{{ formatNumber(totalViews) }}
      </b-col>
    </b-row>
    <b-row class="text-center pb-5">
      <b-col>
        <span class="metrics-label">Readership Date Range:</span>
        <span>{{ readershipDateRange }}</span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentMetricsSummary",
  data() {
    return {
      uniqueReaders: 0,
      totalViews: 0,
    };
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
    queryParams: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.retrieveMetrics();
  },
  computed: {
    linkPath() {
      return `/documents/${this.document.documentNumber}`;
    },
    readershipDateRange() {
      let startDate = this.formatDateTime(
        this.queryParams.readership_start_date
      );
      let endDate = this.formatDateTime(this.queryParams.readership_end_date);
      return `${startDate} Through ${endDate}`;
    },
  },
  methods: {
    retrieveMetrics() {
      axios
        .get(this.linkPath + "/metrics/total_views.json", {
          params: this.queryParams,
        })
        .then((response) => {
          this.totalViews = response.data;
        });
      axios
        .get(this.linkPath + "/metrics/unique_readership.json", {
          params: this.queryParams,
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
};
</script>

<style scoped lang="scss">
.metrics-label {
  font-weight: bold;
  padding-right: 0.5rem;
}
</style>
