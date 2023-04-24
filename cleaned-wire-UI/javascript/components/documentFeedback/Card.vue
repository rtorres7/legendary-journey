<template>
  <div>
    <b-card-body
      class="d-flex p-5"
      :class="{ 'secondary pt-6 position-relative locked': locked }"
    >
      <div class="special-ie-happy-flex-grow">
        <div class="d-flex">
          <b-card-title class="flex-grow-1 d-flex" title-tag="div">
            <b-form-checkbox
              v-model="article.selected"
              class="pl-3 pt-2"
              v-if="displayCheckBoxes"
            >
            </b-form-checkbox>
            <DocumentLink
              :document="article"
              :section="section"
              :returnPath="returnPath"
              ref="link"
              :ind="index"
            />
          </b-card-title>
        </div>
        <div>
          <b-card-sub-title
            class="mb-3"
            sub-title-text-variant="black"
            sub-title-tag="div"
            >{{ publishedDate }} - {{ subtitle }}</b-card-sub-title
          >
          <span class="fa fa-envelope-o pr-2" /><a
            class="text-bold"
            :href="`mailto:${comment.user._temp_37}&subject=${emailReplySubject}`"
            >{{ comment.user.full_name }}</a
          >
          <span class="text-bold">
            <span class="agency">({{ comment.user.service_or_agency }}) </span>
            - {{ $moment(comment.display_date).fromNow() }} - # {{ comment.id }}
          </span>
          | Type: {{ comment.type }} | Status:
          {{ comment.status }}
        </div>
        <b-card-text class="mt-3">
          <div :class="`pb-5 text-bold ${privacyLevel.toLowerCase()}`">
            {{ privacyLevel }} Comment
          </div>
          <div class="portion_marked_string">{{ comment.body }}</div>
        </b-card-text>
      </div>
    </b-card-body>
    <div class="pl-5">
      <span class="classify pr-2">
        <Classify
          aria-label="Comment Classification"
          label="Classification"
          buttonStyle="link"
          buttonLabel="Re-Classify"
          :item-to-classify.sync="commentClassification"
          :dn="currentUser.dn"
          :classification-favorites="[]"
          @new-classification-selected="updateClassification"
          :portionMark="portionMark"
          required
        />
      </span>
      |
      <b-btn variant="link" class="p-0" @click="removeComment">Remove</b-btn> |
      <span class="fa fa-envelope-o pr-2" /><a
        :href="`mailto:?body=${emailDocumentTitle}&subject=${emailForwardSubject}`"
        >Forward</a
      >
    </div>
    <hr />
  </div>
</template>

<script>
import Classify from "@shared/Classify";
import Date from "@shared/Date";
import DocumentLink from "@shared/DocumentLink";
import { isEmpty } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  name: "FeedbackCard",
  components: { Date, DocumentLink, Classify },
  props: {
    article: { required: true },
    returnPath: { required: true },
    section: { required: false },
    index: { required: true },
    comment: { required: true },
    displayCheckBoxes: { default: false, type: Boolean },
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapState("metadata", ["name", "project"]),
    portionMark() {
      return this.project === "bluekey";
    },
    locked() {
      return !isEmpty(this.article.needed);
    },
    subtitle() {
      return `${this.article.doc_num} - ${this.article.producing_office}`;
    },
    publishedDate() {
      return this.formattedDate(this.article.pub_date);
    },
    commentClassification() {
      return {
        id: this.comment.id,
        classification_string: this.comment.classification,
        classification_xml: this.comment.classification_xml,
      };
    },
    privacyLevel() {
      return this.comment.open === true ? "Public" : "Private";
    },
    emailDocumentTitle() {
      return `${encodeURIComponent(
        "(" + this.article.title_classification + ")"
      )} ${this.article.title}`;
    },
    emailForwardSubject() {
      return `Fw: ${this.name} Feedback for ${this.emailDocumentTitle}`;
    },
    emailReplySubject() {
      return `Re: your feedback on ${this.emailDocumentTitle}`;
    },
  },

  methods: {
    updateClassification(payload) {
      const previousClassification = {
        classification: this.comment.classification,
        classification_xml: this.comment.classification_xml,
      };
      this.comment.classification = payload.classification_string;
      this.comment.classification_xml = payload.classification_xml;
      this.$store.dispatch("documentFeedbacks/reclassify", {
        comment: this.comment,
        previousClassification: previousClassification,
        commentClassification: {
          classification: this.comment.classification,
          classification_xml: this.comment.classification_xml,
        },
        caller: this,
      });
    },
    removeComment(event) {
      this.$store.dispatch("documentFeedbacks/removeComment", {
        commentId: this.comment.id,
        caller: this,
      });
    },
    formattedDate(value) {
      if (value) {
        return this.$moment(value).format("DD MMM YYYY");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

::v-deep .document_link {
  font-size: $font-size-5;
}

.special-ie-happy-flex-grow {
  flex: 1 1 0%;
}
.text-success {
  font-weight: bold;
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
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}

.classify {
  display: inline-block;
}

::v-deep .classification-text {
  font-weight: bold;
}

.private {
  color: $red;
}
</style>
