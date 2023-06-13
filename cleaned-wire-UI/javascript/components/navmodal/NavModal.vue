<template>
  <div>
    <div class="product-group-nav-container">
      <b-button-toolbar
        v-if="productList.length > 0"
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
              product</span
            >
          </b-button>
          <span class="align-self-center h2">{{ listName }}</span>
          <span class="align-self-center ml-3 h3"
            >({{ productList.indexOf(docNum) + 1 }} of
            {{ productList.length }})</span
          >
          <b-button
            class="align-self-center ml-8 mr-auto"
            variant="outline-dark"
            :class="{ disabled: !next }"
            :to="routeToNext"
            data-usage="nav-modal-next"
          >
            Next<span class="sr-only"> product</span
            ><span class="pl-3 fa fa-angle-right"></span>
          </b-button>
        </span>
      </b-button-toolbar>
    </div>
    <div id="pageMainContent">
      <Document />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Document from "../document/Document";
import navmodalLoader from "@shared/mixins/navmodalLoader";
import { flatten, concat } from "lodash";

export default {
  name: "NavModal",
  components: { Document },
  mixins: [navmodalLoader],
  props: ["docNum", "returnPath", "section"],

  computed: {
    ...mapState("products", [
      "additionalContent",
      "headlineStack",
      "headlineTitle",
      "highlights",
      "featured",
      "more",
    ]),
    ...mapState("search", ["results"]),
    ...mapState("metadata", ["highlightsNavHeader"]),
    ...mapState("navmodal", [
      "next",
      "previous",
      "productList",
      "listName",
      "returnUrl",
    ]),
    routeToNext() {
      return {
        name: "document",
        params: {
          docNum: this.next || this.docNum,
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
    ...mapMutations("navmodal", ["setProductList"]),
    ...mapActions("navmodal", ["setNextPrevious"]),
    setView(docNum) {
      this.setProducts(this.section);
      if (this.productList.indexOf(docNum) === -1) {
        this.setProductList([]);
      } else {
        this.setNextPrevious(docNum);
      }
    },
    setProducts(section) {
      let products = [];
      switch (section) {
        case "_temp_538":
          products = [];
          this.additionalContent.content_cards.forEach((contentType) =>
            products.push(contentType.products)
          );
          products = flatten(products);

          this.setupNavModal("Across the _temp_6", products, this.returnPath);
          break;
        case "acrossTheFBI":
          products = [];
          this.additionalContent.content_cards.forEach((contentType) =>
            products.push(contentType.products)
          );
          products = flatten(products);
          this.setupNavModal("Across the _temp_537", products, this.returnPath);
          break;
        case "headlineStack":
          this.setupNavModal(
            this.headlineTitle,
            this.headlineStack,
            this.returnPath
          );
          break;
        case "highlights":
          this.setupNavModal(
            this.highlightsNavHeader,
            this.highlights.products,
            this.returnPath
          );
          break;
        case "featured":
        case "more":
          this.setupNavModal(
            "Featured Products",
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
.product-group-nav-container {
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
