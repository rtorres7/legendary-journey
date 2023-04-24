<template>
  <div v-if="!loading" class="py-8">
    <FeedHeader />
    <Feeds class="standard-page-margin" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import FeedHeader from "./FeedHeader";
import Feeds from "./Feeds";

export default {
  name: "WireFeeds",

  computed: {
    ...mapState("user", ["loading"]),
  },

  components: { Feeds, FeedHeader },
};
</script>

<style scoped></style>
