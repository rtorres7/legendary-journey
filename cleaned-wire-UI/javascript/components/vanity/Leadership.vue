<template>
  <div>
    <VanityHeader
      :title="$route.params.profileType"
      class="standard-page-margin"
    >
    </VanityHeader>
    <Pills />
    <ResultsWithNav class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import vanityPage from "@shared/mixins/vanityPage";
import VanityHeader from "@shared/VanityHeader";
import ResultsNav from "@shared/ResultsNav";
import ResultsWithNav from "../search/ResultsWithNav";
import Pills from "../search/pills/Pills";

export default {
  name: "Leadership",
  components: {
    ResultsWithNav,
    Pills,
    VanityHeader,
    ResultsNav,
  },
  mixins: [vanityPage],
  computed: {
    ...mapState("metadata/criteria", ["loading"]),
    ...mapState("search", ["showFilters"]),

    query() {
      return _.merge(
        this.getSearchHashForLeadership(this.$route.params.profileType),
        {
          view: "grid",
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.title-block {
  position: relative;
}
</style>
