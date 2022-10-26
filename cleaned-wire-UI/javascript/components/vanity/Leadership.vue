<template>
  <div>
    <VanityHeader :title="profileType" class="standard-page-margin">
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
import { merge } from "lodash";

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
    profileType() {
      return this.$route.params.profileType;
    },
    query() {
      return merge(this.getSearchHashForLeadership(this.profileType), {
        view: "grid",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.title-block {
  position: relative;
}
</style>
