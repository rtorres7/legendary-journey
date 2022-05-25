<template>
    <div class="chartDiv" ref="chartdiv"></div>
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
            fill: am5.color(0x677935),
            stroke: am5.color(0xffffff),
        });
        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
            strokeWidth: 2,
            fillOpacity: 0.5
        });
    }
}
</script>

<style scoped lang="scss">
.chartDiv {
    width: 100%;
    height: 500px;
}
</style>
