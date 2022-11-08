<template>
  <div
    class="
      flex flex-col
      space-y-3
    "
  >
    <p class="font-semibold">Metrics</p>
    <p class="font-medium text-md">Unique Readers ({{ uniqueReaders }})</p>
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <label :for="datepickerUuid" class="text-sm font-medium">Start Date</label>
        <BaseDatepicker 
          :id="datepickerUuid"
          v-model="readershipStartDate"
          :minDate="articleDetails.display_date"
          :maxDate="new Date(readershipEndDate)"
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
          :minDate="new Date(readershipStartDate)"
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
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
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
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const datepickerUuid = uniqueID().getID();
    const uniqueReaders = computed(() => store.state.metrics.uniqueReaders);
    const readership = computed(() => store.state.metrics.readership);
    let readershipStartDate = ref();
    let readershipEndDate = ref();
    const chartdiv = ref(null);
    
    const handleStartDate = (modelData) => {
      readershipStartDate = formatDate(modelData);
      store.dispatch("metrics/updateStartDate", readershipStartDate);
    };

    const handleEndDate = (modelData) => {
      readershipEndDate = formatDate(modelData);
      store.dispatch("metrics/updateEndDate", readershipEndDate);
    };

    const formatDate = (date) => {
      return dayjs(date).format("YYYY-MM-DD");
    }

    const today = ref(formatDate(dayjs()));

    onMounted(() => {
      store.dispatch("metrics/initDates",
        {readershipStartDate: props.articleDetails.display_date, readershipEndDate: today.value});
      store.dispatch("metrics/getMetrics");
      
      readershipStartDate.value = dayjs(props.articleDetails.display_date).format("MMM DD, YYYY");
      readershipEndDate.value = dayjs(today.value).format("MMM DD, YYYY");

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
      series.data.setAll(readership.value);
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
        () => {series.data.setAll(readership.value), legend.data.setAll(series.dataItems)}
      );
    });

    watch(
      () => route.params,
      () => {
        store.dispatch("metrics/getMetrics");
        store.dispatch("metrics/initDates",
        {readershipStartDate: props.articleDetails.display_date, readershipEndDate: today.value});        
        console.log("date", readershipStartDate.value = dayjs(props.articleDetails.display_date).format("MMM DD, YYYY"));
        readershipEndDate.value = dayjs(today.value).format("MMM DD, YYYY");
      }
    );

    return {
      datepickerUuid,
      uniqueReaders,
      readership,
      readershipStartDate,
      readershipEndDate,
      chartdiv,
      handleStartDate,
      handleEndDate,
      today,
    };
  },
};
</script>

<style lang="scss"></style>
