<template>
    <div>
        <div class="chartDiv hidden lg:block" ref="chartdiv"></div>
        <p class="lg:ml-64 mt-6">
            View a <button @click="openPDF" class="underline"> list of countries </button> that fall under each region and subregion
        </p>
    </div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

export default {
    name: 'RegionsMap',
    mounted() {
        let root = am5.Root.new(this.$refs.chartdiv);
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
                exclude: ["AQ"]
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
    },
    methods: {
        openPDF() {
            window.open("./List-of-Countries-by-Region-UN-Annex-II.pdf");
        }
    }
}
</script>

<style scoped lang="scss">
.chartDiv {
    width: 100%;
    height: 500px;
}
</style>
