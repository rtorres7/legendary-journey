<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col">
      <div class="text-sm">
        <label for="startDate">Start Date</label>
      </div>
      <div>
        <input 
          type="date"
          name="startDate" 
          id="startDate" 
          class="
            text-sm 
            border-2
            border-slate-900/20
            bg-gray-50
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300
          "
        >
      </div>
    </div>
    <div class="flex flex-col">
      <div class="text-sm">
        <label for="endDate">End Date</label>
      </div>
      <div>
        <input 
          type="date"
          name="endDate" 
          id="endDate"
          class="
            text-sm
            border-2
            border-slate-900/20
            bg-gray-50
            dark:text-dark-navy
            dark:bg-slate-300
            energy:text-gray-900
            energy:bg-gray-300
          "
        >
      </div>
    </div>
  </div>
  <div class="w-full h-[400px] text-xs" ref="chartdiv"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import { metrics } from "@/data";

export default {
  setup() {
    const chartdiv = ref(null);

    onMounted(() => {
      let root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);
      let chart = root.container.children.push( 
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
        }) 
      );
      const readership = [
            {
                name: "Intelligence",
                y: 1842
            },
            {
                name: "Law Enforcement",
                y: 72
            },            
            {
                name: "Policy",
                y: 196
            },
            {
                name: "Unknown",
                y: 5
            },
            {
                name: "Warfighter",
                y: 493
            },            
        ];
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
      series.data.setAll(readership);
      series.labels.template.set("forceHidden", true);
      series.ticks.template.set("forceHidden", true);

      let legend = chart.children.push( 
        am5.Legend.new(root, {
          x: am5.percent(50),
          layout: root.verticalLayout
        }
      )
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
