<template>
  <div>
    <h3 class="d-none d-md-block sr-only">Quick Result Filters</h3>
    <Aggregate
      v-for="(aggregate, aggregateName, ind) in aggregations"
      :key="ind"
      :aggregateName="aggregateName"
      :aggregate="aggregate"
      class="d-none d-md-block"
    />
  </div>
</template>

<script>
import AggregationsMixin from "./AggregationsMixin";

export default {
  name: "Aggregations",
  mixins: [AggregationsMixin],
};
</script>

<style scoped lang="scss"></style>
