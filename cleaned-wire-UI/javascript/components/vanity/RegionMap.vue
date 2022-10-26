<template>
  <div class="region-map" ref="map" :class="{ inNav }"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "assets/wireWorldLow";

export default {
  name: "RegionMap",
  props: ["inNav"],
  data() {
    return {
      mapLocations: {
        Africa: {
          longitude: -15,
          latitude: -5,
          zoom: 3,
        },
        "Africa, Southern": {
          longitude: -30,
          latitude: 25,
          zoom: 3,
        },
        Europe: {
          longitude: -20,
          latitude: -55,
          zoom: 3.5,
        },
        Americas: {
          longitude: 80,
          latitude: 0,
          zoom: 1,
        },
        Asia: {
          longitude: -20,
          latitude: -55,
          zoom: 3.5,
        },
        Eurasia: {
          longitude: -20,
          latitude: -55,
          zoom: 3.5,
        },
        "Middle East": {
          longitude: -20,
          latitude: -55,
          zoom: 3.5,
        },
        Oceania: {
          longitude: 240,
          latitude: 10,
          zoom: 2,
        },
        Worldwide: {
          longitude: 0,
          latitude: 0,
          zoom: 1,
        },
      },
    };
  },

  mounted() {
    this.buildMap();
  },

  computed: {
    areaName() {
      if (this.$route.params.regionName) {
        return this.$route.params.regionName;
      } else if (this.$route.params.subregionName) {
        if (this.mapLocations[this.$route.params.subregionName]) {
          return this.$route.params.subregionName;
        } else {
          return "Worldwide";
        }
      } else {
        //TODO Fix this default to something more sane
        return "Worldwide";
      }
    },
  },

  methods: {
    buildMap() {
      let _this = this;
      let map = am4core.create(this.$refs.map, am4maps.MapChart);
      let polygonSeries = new am4maps.MapPolygonSeries();

      polygonSeries.useGeodata = true;

      map.zoomControl = new am4maps.ZoomControl();

      map.geodata = am4geodata_worldLow;
      map.projection = new am4maps.projections.Miller();
      polygonSeries.exclude = ["ATA"];

      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tabindex = "-1";
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = am4core.color("#d0d1d7");

      map.seriesContainer.resizeable = false;

      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#6a737b");

      polygonTemplate.events.on("hit", function (event) {
        _this.goToCountry(event.target.dataItem.dataContext.name);
      });

      map.series.push(polygonSeries);
    },

    goToCountry(name) {
      this.$router.push({
        name: "countries",
        params: {
          countryName: name,
        },
      });
      this.$emit("countrySelected");
    },
  },
};
</script>

<style scoped lang="scss">
.region-map {
  height: 300px;
  width: 100%;
}

.inNav {
  height: 60vh;
  max-height: 500px;
}
</style>
