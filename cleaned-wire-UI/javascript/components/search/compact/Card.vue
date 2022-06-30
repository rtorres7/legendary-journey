<template>
  <div>
    <b-card-body
      class="d-flex p-5"
      :class="{ 'secondary pt-6 position-relative locked': locked }"
    >
      <transition name="bounce">
        <b-form-checkbox
          :value="article.id"
          v-show="selecting && selecting !== 'saveSearch'"
          :disabled="locked"
          :class="{ locked }"
        ></b-form-checkbox>
      </transition>
      <Date :class="{ locked }" fullDate :documentDate="publishedDate" />
      <div class="special-ie-happy-flex-grow">
        <div class="d-flex">
          <b-card-title
            class="flex-grow-1 d-flex align-items-center m-0"
            title-tag="div"
          >
            <DocumentLink
              :document="article"
              :section="section"
              :returnPath="returnPath"
              ref="link"
              :ind="index"
            />
          </b-card-title>
          <b-card-sub-title
            class="_temp_488-5 mt-3"
            sub-title-text-variant="black"
            sub-title-tag="div"
            >{{ subtitle }}</b-card-sub-title
          >
        </div>
        <b-card-text class="mt-3">
          <div v-if="article.summary && article.summary != 'None.'">
            <PortionMarkedString
              :portionMark="article.summary_classification"
              :textString="article.highlighted_result || article.summary"
            />
          </div>
          <span v-else>No Summary Available</span>
        </b-card-text>
      </div>
    </b-card-body>
    <hr />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Date from "@shared/Date";
import DocumentLink from "@shared/DocumentLink";
import PortionMarkedString from "@shared/PortionMarkedString";
import { isEmpty } from "lodash";

export default {
  name: "card",
  components: { Date, DocumentLink, PortionMarkedString },
  props: ["article", "returnPath", "section", "index"],

  computed: {
    ...mapState("search", ["selecting"]),

    locked() {
      return !isEmpty(this.article.needed);
    },

    subtitle() {
      return this.article.doc_num;
    },

    publishedDate() {
      // TODO would like to do a pass on this to get moment involved
      return this.article.date_published;
    },
  },

  methods: {
    focus() {
      this.$refs.link.$el.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
}

.card-subtitle {
  white-space: nowrap;
}

/deep/ .document_link {
  font-size: $font-size-5;
}

/deep/ .wire-date {
  margin-top: 9px;
}

.special-ie-happy-flex-grow {
  flex: 1 1 0%;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
