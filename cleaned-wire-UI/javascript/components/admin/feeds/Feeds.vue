<template>
  <div class="mt-6 standard-page-margin feeds">
    <vanity-title title="Recommended Feeds"></vanity-title>
    <div>
      <b-row>
        <b-col cols="24" md="20">
          <p class="mt-6">
            Below are the front page feeds. You can add new feeds or edit the
            current list and their default status.
          </p>
          <div v-if="loading">
            <spinner />
          </div>
          <b-row class="mb-8 feeds-list">
            <b-col v-for="feed in feeds" :key="feed.id" cols="24" lg="12">
              <Feed :feed="feed" />
            </b-col>
          </b-row>
        </b-col>
        <b-col class="pl-3" cols="24" md="4">
          <CreateRecommendedFeedForm />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import VanityTitle from "../../vanity/VanityTitle";
import Spinner from "../../shared/Spinner";
import Feed from "./Feed";
import CreateRecommendedFeedForm from "./CreateRecommendedFeedForm";
import { mapGetters } from "vuex";

export default {
  name: "Feeds",
  components: {
    CreateRecommendedFeedForm,
    Feed,
    Spinner,
    VanityTitle,
  },

  mounted() {
    this.$store.dispatch("feeds/loadRecommendedFeeds");
  },
  computed: {
    ...mapGetters("feeds", ["feeds", "loading"]),
  },
};
</script>

<style scoped lang="scss">
.feeds {
  padding-bottom: 6rem;
}

::v-deep label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
