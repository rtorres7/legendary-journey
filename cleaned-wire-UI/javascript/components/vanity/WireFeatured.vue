<template>
  <div class="featured-products d-flex">
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
          v-for="(product, ind) in products"
          :key="ind"
          v-if="ind < 4"
          :product="product"
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
      products: [],
      loading: true,
    };
  },

  methods: {
    fetchProducts() {
      // 10085 is "WIRe Intelligence Review"
      var _temp_1 =
        "/search?" +
        this.$route.fullPath.split("?")[1] +
        "&product_types[]=10085";
      axios.get(_temp_1).then((response) => {
        this.products = [];
        response.data.results.forEach(
          function (item) {
            this.products.push(item);
          }.bind(this)
        );
        this.loading = false;
      });
    },

    handleResponse() {
      this.loading = true;
      this.fetchProducts();
    },
  },

  mounted() {
    this.fetchProducts();
    this.$bus.$on("vanity-page-update", this.handleResponse);
  },
};
</script>

<style scoped lang="scss">
.featured-products {
  height: 361px;
}
</style>
