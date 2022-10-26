<template>
  <div id="comments" class="d-print-none">
    <b-row class="pri-800 separator pb-2">
      <b-col
        ><h2 class="my-2">Discussion ({{ comments.length }})</h2></b-col
      >
      <b-col
        class="text-right"
        v-if="!metadataLoading && featuresAvailable.documentSubscribe"
        ><DocumentSubscription :subscribed="subscribed"
      /></b-col>
    </b-row>
    <b-row class="pt-4" v-if="comments.length === 0">
      <b-col cols="24">
        <p class="disclaimer">There are no comments yet.</p>
      </b-col>
    </b-row>
    <b-row
      :id="`comment_${comment.id}`"
      :class="`pt-2 comment ${comment.status} separator`"
      v-for="comment in comments"
      :key="comment.id"
    >
      <b-col class="user-_temp_37"
        ><h3>
          <a
            :name="`comment_${comment.id}`"
            :href="`mailto:${comment.user_email}`"
            >{{ comment.user_name }}</a
          >
        </h3></b-col
      >
      <b-col class="comment-text text-right">
        <span class="date">{{ $moment(comment.display_date).fromNow() }}</span>
        <span class="pending">Pending {{ name }} Review</span>
      </b-col>
      <b-col cols="24">
        <p class="portion-mark">({{ comment.classification }})</p>
        <p class="comment-text">{{ comment.body }}</p>
      </b-col>
    </b-row>
    <b-row class="pt-4">
      <DocumentCommentForm
        @commentsUpdated="retrieveComments"
      ></DocumentCommentForm>
    </b-row>
  </div>
</template>

<script>
import DocumentCommentForm from "../document/DocumentCommentForm";
import DocumentSubscription from "../document/DocumentSubscription";
import { mapState } from "vuex";

export default {
  name: "DocumentComments",
  components: {
    DocumentCommentForm,
    DocumentSubscription,
  },
  mounted() {
    this.retrieveComments();
  },
  computed: {
    ...mapState("metadata", ["name"]),
    ...mapState("document", ["comments", "subscribed"]),
    ...mapState("metadata", ["metadataLoading", "featuresAvailable"]),
  },
  methods: {
    retrieveComments() {
      this.$store.dispatch("document/retrieveComments", {
        docNum: this.$route.params["docNum"],
      });
    },
  },
  watch: {
    $route() {
      this.retrieveComments();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}
.portion-mark {
  color: $alt-800;
  font-size: 85%;
}
.disclaimer {
  color: $alt-800;
  justify-content: left;
  font-size: $font-size-2;
}
.comment-text {
  font-size: $font-size-2;
}
.user-_temp_37 h3 {
  font-size: $font-size-4;
}
.pending {
  display: none;
  color: #c93825;
  font-style: italic;
}
</style>
