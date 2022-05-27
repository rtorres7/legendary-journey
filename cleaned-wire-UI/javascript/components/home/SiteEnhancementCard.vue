<template>
  <b-card
    class="site-enhancement"
    :class="{ 'h-100': siteEnhancementLayout != 'compact' }"
    no-body
  >
    <b-card-body class="d-flex flex-column">
      <WireBackgroundAsset
        image-name="slash-cropped.svg"
        class="flex-grow-1"
        blue-background
      >
        <div
          class="h-100 selectable"
          :class="siteEnhancementLayout"
          @click="clickCard($event)"
        >
          <div class="d-flex h-100 align-items-center">
            <!-- The date below is used as a spacer in the list layout to properly align with
              result cards -->
            <Date
              fullDate
              class="spacer px-5"
              :documentDate="publishedDate"
              v-if="siteEnhancementLayout === 'compact'"
            />
            <div class="flex-grow-1">
              <b-card-title>
                <document-link
                  ref="documentLink"
                  :document="article"
                  :section="section"
                  :return-path="returnPath"
                />
              </b-card-title>
              <div class="summary">
                <span class="portion_marked_field">
                  ({{ article.summary_classification }})
                </span>
                {{ truncatedSummary }} <strong>Explore >>></strong>
              </div>
            </div>
          </div>
        </div>
      </WireBackgroundAsset>
      <GotIt :doc_num="article.doc_num" />
    </b-card-body>
  </b-card>
</template>

<script>
import GotIt from "./featured/GotIt";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import FeaturedCardMixin from "./featured/FeaturedCardMixin";
import Date from "@shared/Date";
export default {
  name: "SiteEnhancementCard",
  components: { Date, WireBackgroundAsset, GotIt },
  computed: {
    siteEnhancementLayout() {
      let layout = "compact"; // list
      if (this.section === "featured") {
        layout = "featured";
      } else if (this.$route.query.grid) {
        layout = "_temp_369"; // grid
      }
      return layout;
    },
    publishedDate() {
      return this.article.posted_at;
    },
  },
  mixins: [FeaturedCardMixin],
};
</script>

<style scoped lang="scss">
.site-enhancement {
  border-radius: unset;
  border: 1px solid $alt-400;
  color: $text-light;
  box-shadow: 0 3px 1px rgba(0, 0, 0, 0.1);

  .summary,
  a {
    color: $text-light;

    &:visited {
      color: $text-light !important;
    }
  }

  .featured {
    padding-top: $spacer-5;
    padding-bottom: $spacer-5;

    > div {
      padding-left: $spacer-9;
      padding-right: $spacer-9;
    }
    .card-title {
      font-size: $font-size-7;
      padding-left: $spacer-9;
      padding-right: $spacer-9;
      text-align: center;
    }
    .summary {
      font-size: $font-size-3;
    }
  }

  .compact {
    padding-top: $spacer-5;
    padding-bottom: $spacer-5;

    .card-title {
      font-size: $font-size-6;
      padding-right: $spacer-6;
    }
    .summary {
      font-size: $font-size-3;
      padding-right: $spacer-6;
    }
    .spacer {
      visibility: hidden;
    }
  }

  ._temp_369 {
    padding-top: $spacer-5;
    padding-bottom: $spacer-5;

    .card-title {
      font-size: $font-size-6;
      padding-left: $spacer-7;
      padding-right: $spacer-7;
    }

    .summary {
      display: none;
    }
  }

  /deep/ .portion_marked_field {
    color: $text-light !important;
  }
}

.card-padding {
  padding: 24px 24px 24px 36px;
}

/deep/ .selectable {
  cursor: pointer;
}

/deep/ .card-body {
  padding: 0;
}
</style>
