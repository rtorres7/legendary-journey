<template>
  <div v-if="!metadataLoading && !featuresAvailable.tags">
    <NotFound />
  </div>
  <div v-else class="mt-6 standard-page-margin">
    <vanity-title :title="pageTitle"></vanity-title>
    <div>
      <b-row>
        <b-col cols="24" md="20">
          <div
            v-if="loading"
            class="d-flex justify-content-center align-items-center loading-area"
          >
            <spinner />
          </div>
          <div
            v-else-if="tagGroups.tag_groups && tagGroups.tag_groups.length == 0"
          >
            This user has not yet tagged documents.
          </div>
          <div v-else>
            <p class="mt-6">All of your document tags sorted alphabetically</p>
            <b-row class="mb-8" role="tablist">
              <b-col
                v-for="(tag_group, index) in this.tagGroups.tag_groups"
                :key="index"
                sm="24"
                lg="12"
              >
                <TagGroup :tag_group="tag_group" />
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col class="_temp_488-3" cols="24" md="4">
          <TagCloud :top_tags="topTags" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import TagGroup from "./TagGroup";
import TagCloud from "./TagCloud";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import NotFound from "../shared/errors/NotFound";

import { mapGetters, mapState } from "vuex";

export default {
  name: "MyTags",
  components: {
    VanityTitle,
    Spinner,
    TagGroup,
    TagCloud,
    NotFound,
  },
  mounted() {
    this.loadTagsForUser();
  },
  computed: {
    ...mapGetters("tags", ["tagGroups"]),
    ...mapGetters("tags", ["taggedBy"]),
    ...mapGetters("tags", ["topTags"]),
    ...mapGetters("tags", ["loading"]),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
    pageTitle() {
      return this.taggedBy && this.taggedBy.first_name != ""
        ? `${this.taggedBy.first_name}'s Tags`
        : "";
    },
    userId() {
      return this.$route.params.id;
    },
  },
  methods: {
    loadTagsForUser() {
      this.$store.dispatch("tags/loadTagsForUser", {
        userId: this.userId,
        query: this.$route.query,
        caller: this,
        showLoader: true, // Displays the larger loader
      });
    },
  },
  watch: {
    userId() {
      this.loadTagsForUser();
    },
  },
};
</script>
