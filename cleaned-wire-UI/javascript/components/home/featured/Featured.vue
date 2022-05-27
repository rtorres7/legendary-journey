<template>
  <div>
    <b-row class="custom-gutters">
      <b-col
        v-for="(article, ind) in all_articles"
        :key="ind"
        cols="24"
        :md="ind < 2 && inFeaturedOrEnhancement(article) ? '24' : '12'"
        :lg="ind < 2 && inFeaturedOrEnhancement(article) ? '12' : '8'"
        class="custom-gutter-col"
      >
        <SiteEnhancementCard
          v-if="ind === 0 && siteEnhancementAvailable"
          :article="article"
          section="featured"
          :return-path="$route.fullPath"
        />
        <Card
          v-else
          :key="ind"
          :ind="ind"
          :article="article"
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
import { mapState } from "vuex";
import CardViewRow from "@shared/CardViewRow";
import preloader from "@shared/mixins/preloader";
import Card from "./Card";
import { isEmpty } from "lodash";
import SiteEnhancementCard from "../SiteEnhancementCard";

export default {
  name: "Featured",
  components: { SiteEnhancementCard, Card, CardViewRow },
  mixins: [preloader],
  computed: {
    ...mapState("articles", ["featured", "more", "siteEnhancement"]),
    all_articles() {
      var articles = [];
      if (!isEmpty(this.siteEnhancement)) {
        articles = articles.concat(this.siteEnhancement);
      }
      if (!isEmpty(this.featured)) {
        articles = articles.concat(this.featured);
      }
      if (!isEmpty(this.more)) {
        articles = articles.concat(this.more);
      }
      return articles;
    },

    siteEnhancementAvailable() {
      return !isEmpty(this.siteEnhancement);
    },
  },

  methods: {
    inFeaturedOrEnhancement(article) {
      if (!isEmpty(this.featured)) {
        if (this.featured.includes(article)) {
          return true;
        }
      }
      if (!isEmpty(this.siteEnhancement)) {
        if (this.siteEnhancement.includes(article)) {
          return true;
        }
      }
      return false;
    },
  },

  watch: {
    featured() {
      this.preloadResults(_.concat(this.featured, this.more));
    },
  },
};
</script>

<style scoped></style>
