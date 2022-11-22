<template>
  <div
    class="
      flex flex-col
      space-y-3
    "
  >
    <p class="font-semibold">
      Metrics
    </p>
    <p class="font-medium text-md">
      Unique Readers ({{ articleMetrics.uniqueReaders }})
    </p>
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <label class="text-sm font-medium">Start Date</label>
        <BaseDatepicker 
          v-model="startDate"
          :minDate="article.display_date"
          :maxDate="new Date(endDate)"
          :enableTimePicker="false"
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
          week-start="0"
          auto-apply @update:modelValue="handleStartDate"
        />        
      </div>
      <div class="flex flex-col px-3 pt-4">
        to
      </div>
      <div class="flex flex-col">
        <label class="text-sm font-medium">End Date</label>
        <BaseDatepicker
          v-model="endDate"
          :minDate="new Date(startDate)"
          :enableTimePicker="false"
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
          week-start="0"
          auto-apply @update:modelValue="handleEndDate"
        />
      </div>
    </div>
  </div>
  <div ref="chartdiv" class="w-full h-[400px] text-xs" />
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as dayjs from "dayjs";

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    articleMetrics: {
      type: Object,
      required: true
    },
  },  
  setup(props) {
    const store = useStore();
    const route = useRoute();
    let startDate = ref();
    let endDate = ref();
    
    const chartdiv = ref(null);

    const handleStartDate = (modelData) => {
      startDate = formatDate(modelData);
      store.dispatch("metrics/updateStartDate", startDate);
      store.dispatch("metrics/getMetrics");
    };

    const handleEndDate = (modelData) => {
      endDate = formatDate(modelData);
      store.dispatch("metrics/updateEndDate", endDate);
      store.dispatch("metrics/getMetrics");
    };

    const formatDate = (date) => {
      return dayjs(date).format("YYYY-MM-DD");
    }

    const setDatepickers = () => {
      startDate.value = dayjs(props.articleMetrics.readershipStartDate).format("MMM DD, YYYY");
      endDate.value = dayjs(props.articleMetrics.readershipEndDate).format("MMM DD, YYYY");
    }    

    onMounted(() => {

      setDatepickers();

      let root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
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
      series.data.setAll(props.articleMetrics.readership);
      series.labels.template.set("forceHidden", true);
      series.ticks.template.set("forceHidden", true);

      let legend = chart.children.push(
        am5.Legend.new(root, {
          x: am5.percent(50),
          layout: root.verticalLayout,
        })
      );
      legend.data.setAll(series.dataItems);

      watch(
        () => route.params,
        () => {series.data.setAll(props.articleMetrics.readership), legend.data.setAll(series.dataItems)}
      );
    });

    return {
      startDate,
      endDate,
      chartdiv,
      handleStartDate,
      handleEndDate,
    };
  },
};
</script>

<style lang="scss"></style>
