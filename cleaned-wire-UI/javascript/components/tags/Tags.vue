<template>
  <div v-if="!metadataLoading && !featuresAvailable.tags">
    <NotFound />
  </div>
  <div v-else class="mt-6 standard-page-margin">
    <vanity-title
      :title="`All Tags Starting with ${selectedTagGroup}`"
    ></vanity-title>
    <div>
      <b-row>
        <b-col cols="24" md="20">
          <p class="mt-6">
            Sitewide WIRe tags. Select a Tag to view associated documents. Use
            the navigation bar below to jump through the alphabet or search to
            the right to find a specific Tag.
          </p>
          <div class="text-center my-6 bg-secondary">
            <span v-for="tag_group in allTagGroups" :key="tag_group">
              <b-btn
                :to="{ name: $route.name, query: queryValues(tag_group) }"
                class="tag-title"
                variant="secondary"
                size="sm"
                @click="loadTags"
              >
                {{ tag_group }}
              </b-btn>
            </span>
          </div>
          <div
            v-if="loading"
            class="d-flex justify-content-center align-items-center loading-area"
          >
            <spinner />
          </div>
          <div
            v-else-if="tagGroups.tag_groups && tagGroups.tag_groups.length == 0"
          >
            No Documents have been tagged starting with {{ selectedTagGroup }}.
          </div>
          <div v-else>
            <b-row
              class="mb-8"
              v-for="(tag_group, index) in tagGroups.tag_groups"
              :key="index"
            >
              <b-col
                v-for="tag in tag_group.tags"
                :key="tag.name"
                sm="12"
                md="8"
                lg="6"
              >
                <b-btn
                  :to="'/tags/' + tag.name"
                  variant="link"
                  size="lg"
                  class="text-left tag-subtitle"
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
                @change="$store.dispatch('tags/loadAllTags', $route)"
              ></b-pagination-nav>
            </div>
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
import TagCloud from "./TagCloud";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import NotFound from "../shared/errors/NotFound";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Tags",
  components: {
    VanityTitle,
    Spinner,
    TagCloud,
    NotFound,
  },
  data() {
    return {
      allTagGroups: [..."#ABCDEFGHIJKLMNOPQRSTUVWXYZ@"],
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
    selectedTagGroup() {
      let tagGroup = this.$route.query.text;
      if (tagGroup === undefined) {
        if (this.$route.query.num !== undefined) {
          return "a Number";
        } else if (this.$route.query.sym !== undefined) {
          return "a Symbol";
        } else {
          return "A";
        }
      } else {
        return tagGroup.toUpperCase();
      }
    },
  },
  methods: {
    loadTags() {
      // set initial tag_page so that it is highlighted in pagination
      if (this.$route.query.text) {
        if (!this.$route.query.tag_page) {
          this.$route.query.tag_page = 1;
        }
      }
      this.$store.dispatch("tags/loadAllTags", {
        query: this.$route.query,
        caller: this,
      });
    },
    queryValues(tagGroupName) {
      switch (tagGroupName) {
        case "#":
          return { num: true };
        case "@":
          return { sym: true };
        default:
          return { text: tagGroupName.toLowerCase() };
      }
    },
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.tag_page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
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
}
a.tag-subtitle {
  text-decoration: underline;
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
