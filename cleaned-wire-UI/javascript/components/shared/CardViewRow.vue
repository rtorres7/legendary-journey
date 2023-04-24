<template>
  <b-row class="custom-gutters">
    <b-col
      v-for="(article, ind) in articles"
      :key="ind"
      cols="24"
      :md="featured ? '24' : '12'"
      :lg="featured ? '12' : '8'"
      class="custom-gutter-col"
    >
      <Card
        :key="ind"
        :article="article"
        :hero="featured ? true : false"
        :preload-doc="featured ? true : false"
        :section="section"
        :siteEnhancement="ind < siteEnhancementCount"
        :return-path="returnPath"
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Card from "../home/featured/Card";

export default {
  name: "CardViewRow",

  props: {
    articles: {},
    featured: { default: false },
    returnPath: {},
    section: {},
    siteEnhancementCount: {
      default: 0,
    },
  },

  components: { Card },
};
</script>
