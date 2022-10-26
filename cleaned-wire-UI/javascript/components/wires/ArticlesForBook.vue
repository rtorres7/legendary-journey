<template>
  <div>
    <b-card class="w-100">
      <b-card-header>
        <h2>
          Articles for this Book
          <span class="sr-only"> ({{ totalFeatures }})</span>
        </h2>
        (<span id="article_count">{{ totalFeatures }}</span
        >)
        <span class="btn-group">
          <router-link
            :to="{ name: 'wires', params: { date: featureDate } }"
            class="preview"
            id="placebo"
          >
            Preview Book</router-link
          >
        </span>
      </b-card-header>
      <div id="article-organization">
        <b-card class="panel w-100">
          <b-card-body>
            <draggable
              id="columns"
              tag="ul"
              group="wire-articles"
              class="list-unstyled"
              handle=".sort-handle"
              :list="features"
              @change="featuresChanged"
            >
              <div id="empty-droptarget" v-if="features.length === 0">
                <div id="droptarget" class="droptarget pt-9">
                  <div>
                    <img
                      :src="require('@assets/drag-icon.svg')"
                      alt=""
                      class="drag-icon pb-3"
                    />
                  </div>
                  Drag/drop articles from sidebar
                </div>
              </div>
              <template v-else>
                <li
                  class="list-group-item feature sort-handle"
                  :class="
                    idx === 0
                      ? `headline-article ${feature.document.state}`
                      : feature.document.state
                  "
                  v-for="(feature, idx) in features"
                  :key="feature.id"
                >
                  <WireFeature :feature="feature" canManage draggable />
                </li>
              </template>
            </draggable>
          </b-card-body>
        </b-card>
      </div>
    </b-card>
  </div>
</template>

<script>
import WireFeature from "../wires/WireFeature";
import draggable from "vuedraggable";

export default {
  name: "ArticlesForBook",
  components: {
    WireFeature,
    draggable,
  },
  data() {
    return {
      features: [],
    };
  },
  props: {
    wire: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.retrieveArticlesForBook();
  },
  computed: {
    featureDate() {
      return this.$route.query.date || this.$route.params.date;
    },
    totalFeatures() {
      return this.features ? this.features.length : 0;
    },
  },
  methods: {
    retrieveArticlesForBook() {
      this.features = this.wire.features || [];
    },
    featuresChanged(evt) {
      if (evt.moved) {
        this.saveFeaturedArticlesSortOrder();
      } else if (evt.added) {
        this.addFeaturedArticle(evt.added.element.document.doc_num);
      }
    },
    addFeaturedArticle(docNum) {
      this.$store
        .dispatch(`features/featureProduct`, {
          featureDate: this.featureDate,
          docNum: docNum,
          caller: this,
        })
        .then(() => {
          this.$bus.$emit("featureUpdated");
        });
    },
    saveFeaturedArticlesSortOrder() {
      this.$store.dispatch(`features/saveFeaturedArticlesSortOrder`, {
        featureDate: this.featureDate,
        features: this.features,
        caller: this,
      });
    },
  },
  watch: {
    wire() {
      this.retrieveArticlesForBook();
    },
  },
};
</script>

<style scoped lang="scss">
.preview {
  font-size: $font-size-2;
}
.drag-icon {
  height: 40px;
  width: 40px;
}
.card-body {
  padding-top: 0;
}
</style>
