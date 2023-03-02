<template>
  <div ref="chartdiv" class="w-[480px] lg:w-[425px] h-[200px] text-xs" />
</template>
<script>
import { ref, onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  props: {
    metrics: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartdiv = ref(null);

    onMounted(() => {
      let root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);
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
          legendLabelText: "[{fill}]{category}[/]",
          legendValueText: "[bold {fill}]{value}[/]",
        })
      );
      series.data.setAll(props.metrics);
      series.labels.template.set("forceHidden", true);
      series.ticks.template.set("forceHidden", true);

      let legend = chart.children.push(
        am5.Legend.new(root, {
          y: am5.percent(50),
          centerY: am5.percent(50),
          layout: root.verticalLayout,
        })
      );
      legend.data.setAll(series.dataItems);
    });

    return {
      chartdiv,
    };
  },
};
</script>

<style lang="scss"></style>
