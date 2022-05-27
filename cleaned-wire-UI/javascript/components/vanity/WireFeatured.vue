<template>
  <div class="featured-articles d-flex">
    <spinner
      label="Spinning"
      type="grow"
      class="m-auto"
      v-if="loading"
    ></spinner>
    <div v-else class="w-100">
      <SectionHeader title="Recently Featured" />
      <b-row class="d-flex flex-wrap justify-content-between px-8">
        <WireFeaturedCard
          v-for="(article, ind) in articles"
          :key="ind"
          v-if="ind < 4"
          :article="article"
        ></WireFeaturedCard>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SectionHeader from "../home/SectionHeader";
import WireFeaturedCard from "./WireFeaturedCard";
import Spinner from "../shared/Spinner";

export default {
  name: "WireFeatured",
  components: { Spinner, WireFeaturedCard, SectionHeader },
  data() {
    return {
      articles: [],
      loading: true,
    };
  },

  methods: {
    fetchArticles() {
      // 10085 is "WIRe Intelligence Review"
      var url =
        "/search?" +
        this.$route.fullPath.split("?")[1] +
        "&product_types[]=10085";
      axios.get(url).then((response) => {
        this.articles = [];
        response.data.results.forEach(
          function (item) {
            this.articles.push(item);
          }.bind(this)
        );
        this.loading = false;
      });
    },

    handleResponse() {
      this.loading = true;
      this.fetchArticles();
    },
  },

  mounted() {
    this.fetchArticles();
    this.$bus.$on("vanity-page-update", this.handleResponse);
  },
};
</script>

<style scoped lang="scss">
.featured-articles {
  height: 361px;
}
</style>
