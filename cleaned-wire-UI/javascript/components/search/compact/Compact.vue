<template>
  <b-row>
    <b-col cols="20" lg="16">
      <SiteEnhancementCard
        v-for="(siteEnhancementCard, ind) in siteEnhancement"
        :key="ind"
        :article="siteEnhancementCard"
        section="search"
        :return-path="$route.fullPath"
      />
      <Card
        v-for="(article, index) in results"
        :key="article.doc_num"
        :article="article"
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
import CozyCard from "../../home/featured/Card";
import preloader from "@shared/mixins/preloader";
import Aggregations from "./Aggregations";
import AggregateCollapse from "./AggregateCollapse";

export default {
  name: "Compact",
  components: {
    AggregateCollapse,
    Aggregations,
    Card,
    CozyCard,
    SiteEnhancementCard,
  },
  mixins: [preloader],
  computed: {
    ...mapState("search", ["results", "siteEnhancement"]),
  },
  watch: {
    results() {
      this.preloadResults(this.results);
    },
  },
  mounted() {
    this.preloadResults(this.results);
  },
};
</script>

<style scoped></style>
