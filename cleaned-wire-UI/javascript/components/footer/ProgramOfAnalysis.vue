<template>
  <b-nav-item-dropdown
    v-if="featuresAvailable.poaLinkEnabled"
    id="nav-_temp_489"
    dropup
    text="Program of Analysis"
    data-usage="nav-program-of-analysis"
  >
    <b-dropdown-item v-if="!loading" :to="programOfAnalysisLinks['2022'].url">
      2022 Program of Analysis
    </b-dropdown-item>
    <b-dropdown-item v-if="!loading" :to="programOfAnalysisLinks['2021'].url">
      2021 Program of Analysis
    </b-dropdown-item>
    <b-dropdown-item v-if="!loading" :to="programOfAnalysisLinks['2020'].url">
      2020 Program of Analysis
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ProgramOfAnalysis",
  computed: {
    ...mapState("programOfAnalysisLinks", [
      "programOfAnalysisLinks",
      "loading",
    ]),
    ...mapState("metadata", ["featuresAvailable"]),
  },
};
</script>
