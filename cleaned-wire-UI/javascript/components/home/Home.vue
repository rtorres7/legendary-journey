<template>
  <div>
    <HeadlineStack class="standard-page-margin" />
    <Header class="standard-page-margin" />
    <Featured class="standard-page-margin pb-8" />
    <Highlights class="alt-200-bg" />
    <div class="watermark mt-6" />
    <AdditionalContent class="" v-if="!user.loading && !restricted" />
    <WireFeeds v-if="featuresAvailable.portlets" class="wire-feeds" />
  </div>
</template>

<script>
import Featured from "./featured/Featured";

import { mapActions, mapState } from "vuex";
import HeadlineStack from "./headlineStack/HeadlineStack";
import Highlights from "./highlights/Highlights";
import AdditionalContent from "./additionalContent/AdditionalContent";
import Header from "./Header";
import WireFeeds from "./wireFeeds/WireFeeds";
import frontPages from "@shared/mixins/frontPages";

export default {
  name: "Home",

  components: {
    WireFeeds,
    Header,
    HeadlineStack,
    Highlights,
    AdditionalContent,
    Featured,
  },
  mixins: [frontPages],

  computed: {
    ...mapState("articles", ["loading"]),
    ...mapState("user", ["user", "loading"]),
    ...mapState("metadata", ["featuresAvailable"]),
    restricted() {
      return this.user.congress;
    },
  },

  methods: {
    getArticles() {
      if (this.$route.params.date) {
        this.$store
          .dispatch("articles/getOtherWire", this.$route.params.date)
          .catch(
            function (e) {
              this.handleMissingFrontPage(e, this.$route.params.date);
            }.bind(this)
          );
      } else {
        this.$store.dispatch("articles/getHomeArticles");
      }
      this.$store.dispatch("articles/getSideArticles");
    },
  },

  mounted() {
    this.getArticles();
  },
};
</script>

<style scoped lang="scss">
.watermark {
  background-image: url("../../assets/bk-watermark.svg");
  height: 50%;
  width: 100%;
  position: absolute;
  background-repeat: no-repeat;
  z-index: -1;
}
</style>
