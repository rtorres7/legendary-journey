<template>
  <div>
    <b-row class="custom-gutters">
      <b-col
        v-for="(product, ind) in all_products"
        :key="ind"
        cols="24"
        :md="ind < 2 && inFeaturedOrEnhancement(product) ? '24' : '12'"
        :lg="ind < 2 && inFeaturedOrEnhancement(product) ? '12' : '8'"
        class="custom-gutter-col"
      >
        <SiteEnhancementCard
          v-if="ind === 0 && siteEnhancementAvailable"
          :product="product"
          section="featured"
          :return-path="$route.fullPath"
        />
        <Card
          v-else
          :key="ind"
          :ind="ind"
          :product="product"
          :hero="ind < 2"
          :preload-doc="ind < 2"
          section="featured"
          :return-path="$route.fullPath"
        ></Card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CardViewRow from "@shared/CardViewRow";
import Card from "./Card";
import SiteEnhancementCard from "../SiteEnhancementCard";
import { isEmpty } from "lodash";
import { mapState } from "vuex";

export default {
  name: "Featured",
  components: { SiteEnhancementCard, Card, CardViewRow },
  computed: {
    ...mapState("products", ["featured", "more", "siteEnhancement"]),
    all_products() {
      var products = [];
      if (!isEmpty(this.siteEnhancement)) {
        products = products.concat(this.siteEnhancement);
      }
      if (!isEmpty(this.featured)) {
        products = products.concat(this.featured);
      }
      if (!isEmpty(this.more)) {
        products = products.concat(this.more);
      }
      return products;
    },

    siteEnhancementAvailable() {
      return !isEmpty(this.siteEnhancement);
    },
  },

  methods: {
    inFeaturedOrEnhancement(product) {
      if (!isEmpty(this.featured)) {
        if (this.featured.includes(product)) {
          return true;
        }
      }
      if (!isEmpty(this.siteEnhancement)) {
        if (this.siteEnhancement.includes(product)) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style scoped></style>
