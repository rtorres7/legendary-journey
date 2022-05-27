<template>
  <div>
    <div class="article-group-nav-container">
      <b-button-toolbar
        v-if="articleList.length > 0"
        class="standard-page-margin row py-3 mb-5"
      >
        <span class="col-3">
          <router-link
            class="btn btn-outline-dark"
            :to="returnUrl"
            data-usage="nav-modal-close"
          >
            <span class="fa fa-angle-double-left mr-2"></span>
            Return to List
          </router-link>
        </span>
        <span class="d-flex col-18">
          <b-button
            class="align-self-center ml-auto mr-8"
            variant="outline-dark"
            :disabled="!previous"
            :to="routeToPrevious"
            data-usage="nav-modal-previous"
          >
            <span class="pr-3 fa fa-angle-left"></span> Previous<span
              class="sr-only"
            >
              article</span
            >
          </b-button>
          <span class="align-self-center h2">{{ listName }}</span>
          <span class="align-self-center ml-3 h3"
            >({{ articleList.indexOf(docNum) + 1 }} of
            {{ articleList.length }})</span
          >
          <b-button
            class="align-self-center ml-8 mr-auto"
            variant="outline-dark"
            :class="{ disabled: !next }"
            :to="routeToNext"
            data-usage="nav-modal-next"
          >
            Next<span class="sr-only"> article</span
            ><span class="_temp_488-3 fa fa-angle-right"></span>
          </b-button>
        </span>
      </b-button-toolbar>
    </div>
    <div>
      <rails-view :docNum="docNum" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import RailsView from "../RailsView";
import navmodalLoader from "@shared/mixins/navmodalLoader";
import { flatten, concat } from "lodash";

export default {
  name: "NavModal",
  components: { RailsView },
  mixins: [navmodalLoader],
  props: ["docNum", "returnPath", "section"],

  data() {
    return {
      articleDocNum: null,
    };
  },

  computed: {
    ...mapState("articles", [
      "additionalContent",
      "executiveUpdates",
      "highlights",
      "featured",
      "more",
    ]),
    ...mapState("search", ["results"]),
    ...mapState("metadata", ["highlightsNavHeader"]),
    ...mapState("navmodal", [
      "next",
      "previous",
      "articleList",
      "listName",
      "returnUrl",
    ]),
    routeToNext() {
      return {
        name: "document",
        params: {
          docNum: this.next,
        },
        query: {
          search_text: this.$route.query.search_text,
        },
      };
    },
    routeToPrevious() {
      return {
        name: "document",
        params: {
          docNum: this.previous,
        },
        query: {
          search_text: this.$route.query.search_text,
        },
      };
    },
  },

  methods: {
    ...mapMutations("navmodal", ["setArticleList"]),
    ...mapActions("navmodal", ["setNextPrevious"]),
    setView(docNum) {
      this.setArticles(this.section);
      if (this.articleList.indexOf(docNum) === -1) {
        this.setArticleList([]);
      } else {
        this.setNextPrevious(docNum);
      }
    },
    setArticles(section) {
      switch (section) {
        case "acrossTheCIA":
          let articles = [];
          this.additionalContent.content_cards.forEach((contentType) =>
            articles.push(contentType.articles)
          );
          articles = flatten(articles);

          this.setupNavModal("Across the _temp_28", articles, this.returnPath);
          break;
        case "acrossTheFBI":
          articles = [];
          this.additionalContent.content_cards.forEach((contentType) =>
            articles.push(contentType.articles)
          );
          articles = flatten(articles);
          this.setupNavModal("Across the FBI", articles, this.returnPath);
          break;
        case "executiveUpdates":
          this.setupNavModal(
            "Executive Updates",
            this.executiveUpdates,
            this.returnPath
          );
          break;
        case "highlights":
          this.setupNavModal(
            this.highlightsNavHeader,
            this.highlights.articles,
            this.returnPath
          );
          break;
        case "featured":
        case "more":
          this.setupNavModal(
            "Featured Articles",
            concat(this.featured, this.more),
            this.returnPath
          );
          break;
        case "search":
          this.setupNavModal("Search Results", this.results, this.returnPath);
      }
    },
  },

  mounted() {
    this.setView(this.docNum);
  },

  watch: {
    $route() {
      this.setView(this.docNum);
    },
  },
};
</script>

<style scoped lang="scss">
.article-group-nav-container {
  background: $alt-200;
  color: $pri-800;
}
.btn {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.btn-outline-dark:not(:hover) {
  color: $text-dark;
}
.btn:focus {
  box-shadow: unset;
}
.h2 {
  font-size: $text-xxx-lg;
}
.h3 {
  font-size: $text-xx-lg;
}
.h2,
.h3 {
  margin: 0;
  line-height: initial;
}
</style>
