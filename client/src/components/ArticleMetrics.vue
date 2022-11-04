<template>
  <div
    class="
      flex flex-col
      space-y-3
    "
  >
    <p class="font-semibold">Metrics</p>
    <p class="font-medium text-md">Unique Readers</p>
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <label :for="datepickerUuid" class="text-sm font-medium">Start Date</label>
        <BaseDatepicker 
          :id="datepickerUuid"
          v-model="readershipStartDate"
          :min-date="articleDetails.display_date"
          :max-date="readershipEndDate"        
          :enableTimePicker="false"
          @update:modelValue="handleStartDate"
          format="MMM dd, yyyy"
          class="
            text-sm
            dark:bg-slate-700
            energy:bg-zinc-600
            border border-gray-200
            dark:border-slate-800
            energy:border-zinc-800
            rounded-lg
            shadow-md
            cursor-default
          "
        >
        </BaseDatepicker>        
      </div>
      <div class="flex flex-col px-3 pt-4">to</div>
      <div class="flex flex-col">
        <label :for="datepickerUuid" class="text-sm font-medium">End Date</label>
        <BaseDatepicker
          :id="datepickerUuid"
          v-model="readershipEndDate"
          :min-date="readershipStartDate"
          :enableTimePicker="false"
          @update:modelValue="handleEndDate"
          format="MMM dd, yyyy"
          class="
            text-sm
            dark:bg-slate-700
            energy:bg-zinc-600
            border border-gray-200
            dark:border-slate-800
            energy:border-zinc-800
            rounded-lg
            shadow-md
            cursor-default
          "
        >
        </BaseDatepicker>
      </div>
    </div>
  </div>
  <div class="w-full h-[400px] text-xs" ref="chartdiv"></div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import uniqueID from "@/composables/uniqueID";
import * as dayjs from "dayjs";

export default {
  props: {
    articleDetails: {
      type: Object,
      required: true
    }
  },  
  setup() {
    const store = useStore();
    const metrics = computed(() => store.state.metrics)
    const datepickerUuid = uniqueID().getID();
    let readershipStartDate = ref(dayjs().format("YYYY-MM-DD"));
    let readershipEndDate = ref(dayjs().format("YYYY-MM-DD"));
    const chartdiv = ref(null);

    const handleStartDate = (modelData) => {
      readershipStartDate = dayjs(modelData).format("YYYY-MM-DD");
    };

    const handleEndDate = (modelData) => {
      readershipEndDate = dayjs(modelData).format("YYYY-MM-DD");
    };

    const queryParams = computed(() => {
      const params = {};
      params["readership_start_date"] = readershipStartDate;
      params["readership_end_date"] = readershipEndDate;
      return params;
    });

    onMounted(() => {

      store.dispatch("metrics/getMetrics");

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
          y: 1842,
        },
        {
          name: "Law Enforcement",
          y: 72,
        },
        {
          name: "Policy",
          y: 196,
        },
        {
          name: "Unknown",
          y: 5,
        },
        {
          name: "Warfighter",
          y: 493,
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
          layout: root.verticalLayout,
        })
      );
      legend.data.setAll(series.dataItems);
    });

    return {
      metrics,
      datepickerUuid,
      readershipStartDate,
      readershipEndDate,
      handleStartDate,
      handleEndDate,
      queryParams,
      chartdiv,
    };
  },
};
</script>

<style lang="scss"></style>
