<template>
  <div ref="chartdiv" class="w-[480px] lg:w-[425px] h-[200px] text-xs" />
</template>
<script>
import { ref, onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

export default {
  props: {
    metrics: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const metricsList = ref(props.metrics);
    const sortedMetrics = metricsList.value.sort((a, b) => b.y - a.y);
    const chartdiv = ref(null);

    const createChart = () => {
      let root = am5.Root.new(chartdiv.value);
      root._logo.dispose();
      let myTheme = am5.Theme.new(root);
      root.setThemes([myTheme]);

      if (localStorage.getItem("theme") === "dark") {
        myTheme
          .rule("ColorSet")
          .set("colors", [
            am5.color("#99f6e4"),
            am5.color("#b39eb5"),
            am5.color("#f6c9d2"),
            am5.color("#baa6a0"),
            am5.color("#0d9488"),
          ]);
      } else if (localStorage.getItem("theme") === "energy") {
        myTheme
          .rule("ColorSet")
          .set("colors", [
            am5.color("#f6e39b"),
            am5.color("#ccbe9f"),
            am5.color("#e0dce3"),
            am5.color("#abc3c9"),
            am5.color("#efd055"),
          ]);
      } else {
        myTheme
          .rule("ColorSet")
          .set("colors", [
            am5.color("#1d2146"),
            am5.color("#7d6563"),
            am5.color("#354545"),
            am5.color("#824c71"),
            am5.color("#a23a06"),
          ]);
      }

      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.horizontalLayout,
        })
      );
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Series",
          valueField: "y",
          categoryField: "name",
          alignLabels: false,
          legendLabelText: "[{fill}]{category}:[/]",
          legendValueText:
            "[bold {fill}]{valuePercentTotal.formatNumber('0.0')}%[/]",
        })
      );
      series.data.setAll(sortedMetrics);
      series.labels.template.set("forceHidden", true);
      series.ticks.template.set("forceHidden", true);
      series.slices.template.setAll({ toggleKey: "none", tooltipText: "" });

      let legend = chart.children.push(
        am5.Legend.new(root, {
          y: am5.percent(50),
          centerY: am5.percent(50),
          layout: root.verticalLayout,
          clickTarget: "none",
        })
      );
      legend.itemContainers.template.setup = function (item) {
        item.events.disableType("pointerover");
      };
      legend.data.setAll(series.dataItems);
    };

    onMounted(() => {
      createChart();
    });

    return {
      metricsList,
      sortedMetrics,
      chartdiv,
      createChart,
    };
  },
};
</script>

<style lang="scss"></style>
