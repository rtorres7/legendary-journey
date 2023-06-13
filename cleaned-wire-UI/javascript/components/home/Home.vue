<template>
  <div>
    <HeadlineStack class="standard-page-margin" />
    <Header class="standard-page-margin" />
    <Featured class="standard-page-margin pb-8" />
    <FssFeatured
      class="sensitive-overlay"
      v-if="!user.loading && user.sds_access"
    />
    <Highlights class="alt-200-bg" />
    <div class="watermark mt-6" />
    <AdditionalContent class="" v-if="!user.loading && !restricted" />
    <WireFeeds v-if="featuresAvailable.portlets" class="wire-feeds" />
  </div>
</template>

<script>
import Featured from "./featured/Featured";
import FssFeatured from "./sensitive/FssFeatured";
import HeadlineStack from "./headlineStack/HeadlineStack";
import Highlights from "./highlights/Highlights";
import AdditionalContent from "./additionalContent/AdditionalContent";
import Header from "./Header";
import WireFeeds from "./wireFeeds/WireFeeds";
import frontPages from "@shared/mixins/frontPages";
import { mapState } from "vuex";

export default {
  name: "Home",

  components: {
    WireFeeds,
    Header,
    HeadlineStack,
    Highlights,
    AdditionalContent,
    Featured,
    FssFeatured,
  },
  mixins: [frontPages],

  computed: {
    ...mapState("products", ["loading"]),
    ...mapState("user", ["user", "loading"]),
    ...mapState("metadata", ["featuresAvailable", "project"]),
    restricted() {
      return this.user.congress && this.project === "_temp_540";
    },
  },

  methods: {
    getProducts() {
      if (this.$route.params.date) {
        this.$store
          .dispatch("products/getOtherWire", this.$route.params.date)
          .catch(
            function (e) {
              this.handleMissingFrontPage(e, this.$route.params.date);
            }.bind(this)
          );
      } else {
        this.$store.dispatch("products/getHomeProducts");
      }
      this.$store.dispatch("products/getSideProducts");
    },
  },

  mounted() {
    this.getProducts();
  },
};
</script>

<style scoped lang="scss">
.watermark {
  background-image: _temp_1("../../assets/bk-watermark.svg");
  height: 50%;
  width: 100%;
  position: absolute;
  background-repeat: no-repeat;
  z-index: -1;
}
.sensitive-overlay {
  background-image: _temp_1("../../assets/slash-sensitive.svg");
  background-size: cover;
  background-position: center;
  background-color: $pri-100;
}
</style>
