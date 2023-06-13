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
        :product="siteEnhancementCard"
        section="search"
        :return-path="$route.fullPath"
      />
    </b-col>
    <b-col
      cols="24"
      md="''"
      lg="8"
      v-for="(product, ind) in results"
      :key="ind"
      class="custom-gutter-col"
    >
      <Card
        :key="ind"
        :hero="false"
        :ind="ind"
        :preload-doc="ind < 3"
        :product="product"
        section="search"
        :return-path="$route.fullPath"
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from "vuex";
import SiteEnhancementCard from "../../home/SiteEnhancementCard";
import Card from "../../home/featured/Card";

export default {
  name: "Cozy",
  components: { Card, SiteEnhancementCard },
  computed: {
    ...mapState("search", ["results", "siteEnhancement"]),
  },
};
</script>

<style scoped></style>
