<template>
  <b-card
    class="selectable"
    :class="{ 'feature h-100': feature, hero, locked, focused }"
    @click="clickCard($event)"
    no-body
  >
    <b-card-body class="p-0">
      <div class="d-flex flex-column h-100" v-if="!article.fake">
        <b-row class="card-contents flex-grow-1">
          <b-col
            class="col d-flex flex-column justify-content-between py-5"
            :class="hero ? 'pl-7 pr-6' : 'pl-6 pr-4'"
          >
            <b-card-title title-tag="h3" @click.prevent>
              <DocumentLink
                ref="documentLink"
                :document="article"
                :section="section"
                :returnPath="returnPath"
                @focus="addFocus"
                :ind="ind"
                @focusout="removeFocus"
              />
            </b-card-title>
            <b-card-text>
              <div class="published-date font-size-2 alt-800">
                {{
                  (article.date_published
                    ? article.date_published
                    : article.posted_at) | moment("D MMMM YYYY")
                }}
              </div>
            </b-card-text>
          </b-col>
          <b-col v-if="hasImages" class="col-auto">
            <wire-image :hero="hero" :img-_temp_1="imgUrl" />
          </b-col>
        </b-row>
      </div>
      <FakeCard v-else :hero="hero"></FakeCard>
    </b-card-body>
  </b-card>
</template>

<script>
import WireImage from "@shared/WireImage";
import FakeCard from "./FakeCard";
import FeaturedCardMixin from "./FeaturedCardMixin";
import { isEmpty } from "lodash";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "Card",
  components: { FakeCard, WireImage },
  props: ["ind"],
  data() {
    return { focused: false };
  },
  mixins: [FeaturedCardMixin],

  computed: {
    locked() {
      return !isEmpty(this.article.needed) || this.article.org_restricted;
    },
    hasImages() {
      if (!isEmpty(this.article.needed)) {
        return false;
      }
      if (isEmpty(this.article.images)) {
        // front page & special editions
        return false;
      } else {
        // search page grid view
        if (
          this.article.images.table &&
          isEmpty(this.article.images.table.article)
        ) {
          return false;
        }
      }
      return true;
    },
    imgUrl() {
      // This component gets reused for the search grid view. The controller for that returns
      // a JS object instead of an Array. This is handling the different types. Check the commit
      // message for more details
      let updatedAt;
      if (Array.isArray(this.article.images)) {
        updatedAt = this.article.images.filter(
          (image) => image.usage == "article"
        )[0].updated_at;
      } else if (this.article.images && this.article.images.table.article) {
        updatedAt = this.article.images.table.article.table.updated_at;
      } else {
        updatedAt = "";
      }

      return (
        "/documents/" +
        this.article.doc_num +
        "/images/article?updated_at=" +
        updatedAt
      );
    },
  },

  methods: {
    ...mapActions("articles", ["preloadDocument"]),
    ...mapMutations("articles", ["imagesLoaded"]),
    removeFocus() {
      this.focused = false;
    },
    addFocus() {
      this.focused = true;
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid $alt-400;
  box-shadow: 0 3px 1px rgba(0, 0, 0, 0.1);
  border-radius: unset;

  &:hover,
  &.focused {
    box-shadow: 0 5px 2px rgba(129, 103, 103, 0.25);
    .card-title a {
      color: $link-color !important;
      text-decoration: unset;
      outline: none;
    }
  }
}

.card-title a {
  color: $alt-900;
}

.featured {
  .card-title {
    font-size: $font-size-5;
  }
}

.hero {
  .card-title {
    font-size: $font-size-7;
  }
}

.selectable {
  cursor: pointer;
}

.locked {
  background-color: $alt-300;
}
</style>
