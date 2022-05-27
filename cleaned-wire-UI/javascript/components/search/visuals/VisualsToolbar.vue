<template>
  <div class="visuals-toolbar">
    <!--<b-button-group class="ml-auto">-->
    <!--<VisualsButton-->
    <!--query="media_tags[]"-->
    <!--queryValue="graphic"-->
    <!--displayValue="Graphics"-->
    <!--/>-->
    <!--<VisualsButton-->
    <!--query="media_tags[]"-->
    <!--queryValue="interactive"-->
    <!--displayValue="Interactives"-->
    <!--/>-->
    <!--<VisualsButton-->
    <!--query="media_tags[]"-->
    <!--queryValue="map"-->
    <!--displayValue="Maps"-->
    <!--/>-->
    <!--<VisualsButton-->
    <!--query="media_tags[]"-->
    <!--queryValue="audio"-->
    <!--displayValue="Audio"-->
    <!--/>-->
    <!--<VisualsButton-->
    <!--query="media_tags[]"-->
    <!--queryValue="video"-->
    <!--displayValue="Videos"-->
    <!--/>-->
    <!--</b-button-group>-->
  </div>
</template>

<script>
import VisualsButton from "./VisualsButton";

export default {
  name: "VisualsToolbar",
  components: { VisualsButton },
};
</script>

<style scoped>
.visuals-toolbar {
  display: none;
}
</style>
