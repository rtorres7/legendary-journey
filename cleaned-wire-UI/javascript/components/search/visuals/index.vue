<template>
  <div
    v-masonry
    transition-duration="0.3s"
    column-width="50"
    item-selector=".visuals-card"
  >
    <Card
      v-for="result in results"
      v-masonry-tile
      class="visuals-card"
      :key="result.id"
      :article="result"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "./Card";

export default {
  name: "index",
  components: { Card },
  computed: {
    ...mapState("search", ["results"]),
  },

  mounted() {
    this.$store.dispatch("search/search", this.$route);
  },
};
</script>

<style scoped>
.visuals-card {
  width: 20%;
}
@media only screen and (max-width: 600px) {
  .visuals-card {
    width: 100%;
  }
}
@media only screen and (max-width: 800px) and (min-width: 600px) {
  .visuals-card {
    width: 50%;
  }
}
@media only screen and (min-width: 800px) and (max-width: 1100px) {
  .visuals-card {
    width: 33%;
  }
}
</style>
