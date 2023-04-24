<template>
  <div>
    <div class="text-center" v-if="loading">
      <spinner />
    </div>
    <b-row class="custom-gutters" v-else>
      <Feed v-for="(feed, ind) in portlets.portlets" :key="ind" :feed="feed" />
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Feed from "./Feed";
import Spinner from "../../shared/Spinner";

export default {
  name: "Feeds",
  components: { Spinner, Feed },
  computed: {
    ...mapState("portlets", ["portlets", "loading"]),
  },
  mounted() {
    this.$store.dispatch("portlets/loadPortlets", {
      caller: this,
    });
  },
};
</script>

<style scoped></style>
