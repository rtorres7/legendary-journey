<template>
  <b-row class="custom-gutters">
    <b-col
      cols="24"
      md="''"
      lg="8"
      class="custom-gutter-col"
      v-for="(siteEnhancementCard, ind) in siteEnhancement"
      :key="ind"
    >
      <SiteEnhancementCard
        :article="siteEnhancementCard"
        section="search"
        :return-path="$route.fullPath"
      />
    </b-col>
    <b-col
      cols="24"
      md="''"
      lg="8"
      v-for="(article, ind) in results"
      :key="ind"
      class="custom-gutter-col"
    >
      <Card
        :key="ind"
        :hero="false"
        :ind="ind"
        :preload-doc="ind < 3"
        :article="article"
        section="search"
        :return-path="$route.fullPath"
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from "vuex";
import preloader from "@shared/mixins/preloader";
import SiteEnhancementCard from "../../home/SiteEnhancementCard";
import Card from "../../home/featured/Card";

export default {
  name: "Cozy.vue",
  components: { Card, SiteEnhancementCard },
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
