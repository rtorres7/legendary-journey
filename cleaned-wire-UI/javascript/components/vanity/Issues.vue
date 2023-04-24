<template>
  <div>
    <VanityHeader
      :code="code"
      class="standard-page-margin"
      :title="$route.params.issueName"
    ></VanityHeader>
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import ResultsWithNav from "../search/ResultsWithNav";
import VanityHeader from "@shared/VanityHeader";
import vanityPage from "@shared/mixins/vanityPage";
import Pills from "../search/pills/Pills";

export default {
  name: "Issues",
  components: { Pills, ResultsWithNav, VanityHeader },
  mixins: [vanityPage],
  computed: {
    ...mapState("metadata/criteria/issues", { issues: "values" }),
    ...mapState("metadata", ["loading"]),
    ...mapState("search", ["showFilters"]),

    query() {
      return {
        "issues[]": this.getIssueCodeFromName(this.$route.params.issueName),
        "reporting_types[]": "analysis.all_source",
        view: "grid",
      };
    },
    code() {
      return this.$route.query["issues[]"];
    },
  },
};
</script>

<style scoped></style>
