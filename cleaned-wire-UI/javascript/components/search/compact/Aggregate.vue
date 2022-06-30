<template>
  <div class="my-5">
    <h4 class="aggregation-header">
      <span class="sr-only">Filters for </span>{{ aggregate.displayName }}
    </h4>
    <AggregateLink
      v-for="(aggregateLink, ind) in truncatedList"
      :key="ind"
      :aggregate="aggregateLink"
      :aggregateType="aggregateName"
    />
    <b-btn v-if="showMoreButton" @click="showLess = !showLess" variant="link">
      <span v-if="showLess">Show More ...</span>
      <span v-else>Show Less ...</span>
    </b-btn>
  </div>
</template>

<script>
import AggregateLink from "./AggregateLink";
export default {
  name: "Aggregate",
  components: { AggregateLink },
  props: ["aggregateName", "aggregate"],

  data() {
    return {
      showLess: true,
    };
  },

  computed: {
    truncatedList() {
      if (this.showLess) {
        return this.aggregate.rows.slice(0, 5);
      } else {
        return this.aggregate.rows;
      }
    },

    showMoreButton() {
      return this.aggregate.rows.length > 5;
    },
  },
};
</script>

<style scoped lang="scss">
.aggregation-header {
  margin-bottom: $spacer-3;
  font-size: $font-size-3;
  color: $alt-800;
  font-weight: 600;
}
</style>
