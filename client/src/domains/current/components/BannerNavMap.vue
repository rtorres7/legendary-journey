<template>
  <div ref="chartdiv" class="w-full h-[500px]" />
</template>

<script>
import { getValueForName } from "@current/helpers";
import { computed, ref, onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const chartdiv = ref(null);
    const criteria = computed(() => store.state.metadata.criteria);

    const navigateToCountry = (country) => {
      let query = {
        view: "grid",
        landing: true,
      };
      query["countries[]"] = country.code;
      router.push({
        name: "countries",
        params: {
          name: country.name,
        },
        query,
      });
    };

    onMounted(() => {
      let root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);
      root._logo.dispose();

      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoNaturalEarth1(),
          panX: "translateX",
          panY: "translateY",
        })
      );
      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
        })
      );
      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x6a737b),
      });
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        interactive: true,
        strokeWidth: 1,
        fill: am5.color(0xc2c4cb),
      });
      polygonSeries.mapPolygons.template.events.on("click", function (event) {
        console.log("event.target.dataItem: ", event.target.dataItem);
        let dataItem = event.target.dataItem.dataContext;
        navigateToCountry(
          getValueForName(
            criteria.value.countries,
            dataItem.name === "Türkiye" ? "Turkey" : dataItem.name
          )
        );
      });
    });
    return {
      chartdiv,
    };
  },
};
</script>
