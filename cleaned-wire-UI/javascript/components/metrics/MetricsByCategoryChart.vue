<template>
  <div class="px-6 py-2">
    <div class="chart-no-data" v-if="this.chartData.length === 0">
      <h3>{{ chartTitle }}</h3>
      No data available to display.
    </div>
    <highcharts :options="chartOptions" v-else aria-live="polite"></highcharts>
  </div>
</template>

<script>
import Highchart from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import { Chart } from "highcharts-vue";

highchartsAccessibility(Highchart);

export default {
  name: "MetricsByCategoryChart",
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      pointFormat: "{series.name}: {point.y}</br>",
      legendOptions: {
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
      },
    };
  },
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    chartTitle: {
      type: String,
      default: "",
    },
    chartType: {
      type: String,
      default: "column",
    },
    chartDescription: {
      type: String,
      required: false,
    },
  },
  computed: {
    chartOptions() {
      let selectChartOptions;
      switch (this.chartType) {
        case "column":
          selectChartOptions = this.columnChartOptions;
          break;
        case "line":
          selectChartOptions = this.lineChartOptions;
          break;
        case "pie":
          selectChartOptions = this.pieChartOptions;
          break;
        default:
          selectChartOptions = {};
      }
      return Object.assign({}, this.commonChartOptions, selectChartOptions);
    },
    commonChartOptions() {
      return {
        title: {
          text: this.chartTitle,
        },
        chart: {
          type: this.chartType,
        },
        colors: ["#7ac3fa", "#256AAA", "#021C50", "#8e929f", "#b8e2ff"],
        credits: {
          enabled: false,
        },
        accessibility: {
          keyboardNavigation: { enabled: true },
          announceNewData: { enabled: true },
          description: this.chartDescription,
        },
        lang: {
          accessibility: {
            chartContainerLabel: `${this.chartTitle} Chart`,
          },
        },
      };
    },
    columnChartOptions() {
      return {
        xAxis: {
          categories: this.categories,
        },
        yAxis: {
          title: {
            text: "",
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: "gray",
            },
          },
        },
        tooltip: {
          pointFormat: this.pointFormat,
          split: true,
          distance: 60,
        },
        plotOptions: {
          column: {
            stacking: "normal",
          },
        },
        series: this.series,
        legend: this.legendOptions,
      };
    },
    lineChartOptions() {
      return {
        xAxis: {
          categories: this.categories,
        },
        tooltip: {
          pointFormat: this.pointFormat,
          split: true,
          distance: 15,
        },
        series: this.series,
        legend: this.legendOptions,
      };
    },
    pieChartOptions() {
      return {
        plotOptions: {
          pie: {
            enableMouseTracking: false,
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage: .2f} %",
            },
          },
        },
        series: [{ data: this.chartData }],
      };
    },
    categories() {
      return this.chartData.length > 0 ? this.chartData[0].x : [];
    },
    series() {
      return this.chartData.map((category) => {
        return { name: category.name, data: category.y };
      });
    },
  },
};
</script>

<style scoped>
.chart-no-data {
  position: relative;
  z-index: 2;
  top: 2em;
  min-height: 150px;
  text-align: center;
  padding-bottom: 2em;
}
</style>
