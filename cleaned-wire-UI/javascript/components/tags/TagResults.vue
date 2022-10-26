<template>
  <div v-if="!metadataLoading && !featuresAvailable.tags">
    <NotFound />
  </div>
  <div v-else class="mt-6 standard-page-margin">
    <vanity-title v-if="showTitle" :title="pageTitle"></vanity-title>
    <div>
      <b-row>
        <b-col cols="24" md="20">
          <div v-if="loading">
            <spinner />
          </div>
          <div
            class="py-5"
            v-else-if="tagGroups.tag_groups && tagGroups.tag_groups.length == 0"
          >
            No Tags found containing {{ $route.query.text }}.
          </div>
          <div v-else>
            <b-row class="my-8">
              <b-col
                v-for="tag in tagList"
                :key="tag.name"
                sm="12"
                md="8"
                lg="6"
              >
                <b-btn
                  :to="'/tags/' + tag.name"
                  variant="link"
                  size="lg"
                  class="tag-subtitle text-left"
                >
                  {{ tag.name }}
                  <span class="tag-count">({{ tag.document_count }})</span>
                </b-btn>
              </b-col>
            </b-row>
            <div
              class="d-flex justify-content-center"
              v-if="
                tagGroups.tag_groups && tagGroups.tag_groups[0].tags_pages > 1
              "
            >
              <b-pagination-nav
                :link-gen="paginationLink"
                :number-of-pages="tagGroups.tag_groups[0].tags_pages"
                @change="changePage"
              ></b-pagination-nav>
            </div>
          </div>
        </b-col>
        <b-col class="pl-3" cols="24" md="4">
          <TagCloud :top_tags="topTags" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import TagCloud from "./TagCloud";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import NotFound from "../shared/errors/NotFound";

import { mapGetters, mapState } from "vuex";
import { flatten } from "lodash";

export default {
  name: "TagResults",
  components: {
    VanityTitle,
    Spinner,
    TagCloud,
    NotFound,
  },
  data() {
    return {
      pageChangeLoad: false,
    };
  },
  mounted() {
    this.loadTags();
  },
  computed: {
    ...mapGetters("tags", ["tagGroups"]),
    ...mapGetters("tags", ["topTags"]),
    ...mapGetters("tags", ["loading"]),
    ...mapGetters("user", ["user"]),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
    showTitle() {
      if (this.pageChangeLoad) {
        return true;
      } else {
        return !this.loading;
      }
    },
    tagList() {
      let tags = [];
      if (this.tagGroups.tag_groups && this.tagGroups.tag_groups.length > 0) {
        tags = this.tagGroups.tag_groups.map((tag_group) => tag_group.tags);
      }
      return flatten(tags);
    },
    pageTitle() {
      let totalTags = 0;
      if (this.tagGroups.tag_groups) {
        if (this.tagGroups.tag_groups.length != 0) {
          totalTags = this.tagGroups.tag_groups[0].tags_total;
        }
      }
      return `${totalTags} Tags Containing '${this.$route.query.text}'`;
    },
  },
  methods: {
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.tag_page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
    },
    changePage() {
      this.pageChangeLoad = true;
      this.loadTags();
    },
    loadTags() {
      if (this.$route.query.text) {
        if (!this.$route.query.tag_page) {
          this.$route.query.tag_page = 1;
        }
      }
      this.$store.dispatch("tags/searchTag", {
        pageNum: this.$route.query.tag_page,
        caller: this,
        tagName: this.$route.query.text,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.tag-count {
  font-family: $font-family-heading;
}
.tag-subtitle {
  font-family: $heading-stylized;
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
  &:focus {
    outline: 1px dotted $link-color !important;
  }
  &:visited {
    text-decoration: underline;
  }
}
</style>
