<template>
  <div v-if="!metadataLoading && !featuresAvailable.tags">
    <NotFound />
  </div>
  <div v-else class="standard-page-margin mt-6">
    <vanity-title :title="`All Tags`"></vanity-title>
    <b-row>
      <b-col cols="24" md="20">
        <h4 class="d-flex pt-6">
          {{ tag ? tag.document_count : 0 }} Documents Tagged With "{{
            tagName
          }}"
        </h4>
        <div class="px-6 pb-6" v-if="tag">
          <TagDocuments :tag="tag" @loadTagDocs="loadTagByName" />
        </div>
      </b-col>
      <b-col class="pl-3" cols="24" md="4">
        <TagCloud :top_tags="topTags" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TagDocuments from "./TagDocuments";
import TagCloud from "./TagCloud";
import VanityTitle from "../vanity/VanityTitle";
import NotFound from "../shared/errors/NotFound";

import { mapGetters, mapState } from "vuex";

export default {
  name: "Tag",
  components: { TagDocuments, TagCloud, VanityTitle, NotFound },
  mounted() {
    this.loadTagByName();
  },
  computed: {
    ...mapGetters("tags", ["tag"]),
    ...mapGetters("tags", ["topTags"]),
    ...mapGetters("tags", ["loading"]),
    ...mapGetters("user", ["user"]),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
    tagName() {
      return this.$route.params.tagName;
    },
  },
  methods: {
    loadTagByName() {
      if (this.$route.query && !this.$route.query.page) {
        this.$route.query.page = 1;
      }
      if (this.tagName !== undefined) {
        this.$store.dispatch(`tags/loadTag`, {
          tagName: this.tagName,
          route: this.$route,
          caller: this,
        });
      }
    },
  },
  watch: {
    tagName() {
      this.loadTagByName();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
  margin: 10px;
  padding: 10px;
}
img {
  height: 16px;
  width: 16px;
}
</style>
