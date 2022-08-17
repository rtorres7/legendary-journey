<template>
  <div class="w-full h-[500px]" ref="chartdiv"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useRouter } from "vue-router";
import { metadata } from "@/config";

export default {
  setup() {
   const router = useRouter();
   const chartdiv = ref(null);
    
    const findCountryInMetadata = (dataItem) => {
      let countryCode;
      let countryFound = false;
      metadata.countries.items.forEach((country) => {
        if (dataItem === country.name) {
          countryCode = country;
          countryFound = true;
        }
      });
      if (countryFound) {
        navigateToCountry(countryCode);
      }
      else {
        alert("Error: country not found");
      }
    };

    const navigateToCountry = (country) => {
      let query = {
        "reporting_types[]": "analysis.all_source",
        view: "grid",
        landing: true,
      };

      query[metadata.countries.type] = country.key;
      router.push({
        name: "countries",
        params: {
          name: country.name,
          key: country.key,
        },
        query,
      });
    };
    onMounted(() => {
      let root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);

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
        console.log("clicked on a country", event.target);
        let dataItem = event.target.dataItem.dataContext;
        console.log(dataItem);
        findCountryInMetadata(dataItem.name);
      });
    });
    return {
      chartdiv,
      metadata,
      findCountryInMetadata,
      navigateToCountry,
    };
  },
};
</script>
