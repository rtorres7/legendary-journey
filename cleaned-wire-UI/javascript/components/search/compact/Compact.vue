<template>
  <b-row>
    <b-col cols="20" lg="16">
      <SiteEnhancementCard
        v-for="(siteEnhancementCard, ind) in siteEnhancement"
        :key="ind"
        :product="siteEnhancementCard"
        section="search"
        :return-path="$route.fullPath"
      />
      <Card
        v-for="(product, index) in results"
        :key="`${index}_${product.doc_num}`"
        :product="product"
        :index="index"
        section="search"
        :return-path="$route.fullPath"
      />
    </b-col>
    <b-col offset-lg="2" cols="4" lg="6">
      <AggregateCollapse />
      <Aggregations class="d-none d-lg-block" />
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from "vuex";
import Card from "./Card";
import SiteEnhancementCard from "../../home/SiteEnhancementCard";
import Aggregations from "./Aggregations";
import AggregateCollapse from "./AggregateCollapse";

export default {
  name: "Compact",
  components: {
    AggregateCollapse,
    Aggregations,
    Card,
    SiteEnhancementCard,
  },
  computed: {
    ...mapState("search", ["results", "siteEnhancement"]),
  },
};
</script>

<style scoped></style>
