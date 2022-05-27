<template>
  <b-row class="container-fluid">
    <b-col
      cols="24"
      sm="12"
      md="8"
      v-for="(aggregate, aggregateName, ind) in aggregations"
      :key="ind"
    >
      <Aggregate
        :aggregateName="aggregateName"
        :aggregate="aggregate"
        class="pb-3 pr-3"
      />
    </b-col>
  </b-row>
</template>

<script>
import AggregationsMixin from "./AggregationsMixin";
export default {
  name: "AggregationsRow",
  mixins: [AggregationsMixin],
};
</script>

<style scoped></style>
