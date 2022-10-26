<template>
  <b-col md="12" class="custom-gutter-col" v-if="item.articles.length > 0">
    <div class="additional-content-card white-bg h-100 d-flex flex-column">
      <b-card-title class="ml-7 mb-4 mt-6 card-title" title-tag="h3">
        <router-link
          :to="
            item.path +
            '&search_title=' +
            item.content_heading +
            '&search_reporting_type=' +
            searchReportingType()
          "
        >
          {{ item.content_heading }}
        </router-link>
      </b-card-title>
      <div
        class="py-6 bottom-border flex-fill"
        :class="{
          'top-border px-7 locked': locked(article),
          'mx-7': !locked(article),
        }"
        v-for="article in item.articles"
        :key="article.id"
      >
        <div class="d-flex">
          <Date :documentDate="article.date_published" />
          <DocumentLink
            :document="article"
            :section="section"
            :returnPath="returnPath"
            :data-usage="dataUsage"
          />
        </div>
      </div>
    </div>
  </b-col>
</template>

<script>
import { isEmpty, kebabCase } from "lodash";
import Date from "@shared/Date";
import DocumentLink from "@shared/DocumentLink/index";
import { mapState } from "vuex";

export default {
  name: "ContentItem",
  components: { Date, DocumentLink },
  props: ["item", "section", "returnPath"],
  computed: {
    ...mapState("metadata", ["agency"]),
    dataUsage() {
      // returns something similar to front-page-across-the-cia-clandestine-reporting
      return kebabCase(
        "front-page-across-the-" + this.agency + "-" + this.item.content_heading
      );
    },
  },
  methods: {
    locked(article) {
      return !isEmpty(article.needed) || article.org_restricted;
    },
    searchReportingType() {
      return this.item.path.replace(/.*=/, "");
    },
  },
};
</script>

<style scoped lang="scss">
.card-title {
  font-family: $font-family-sans-serif;
  font-size: $font-size-6;
  font-weight: 500;
  color: $link-color;

  a:visited {
    color: $link-color;
  }
}

.additional-content-card {
  font-size: $font-size-2;
  border: 1px solid $alt-500;
  .bottom-border:not(:last-child) {
    border-bottom: 1px solid $alt-500;
  }
}

.locked {
  background-color: $alt-300;
}
</style>
