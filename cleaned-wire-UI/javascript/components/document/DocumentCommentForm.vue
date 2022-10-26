<template>
  <span>
    <h2 class="pri-800 separator pb-4">Comment</h2>
    <p class="disclaimer">
      <span class="portion-mark">(_temp_52)</span>
      {{ agency }} {{ name }} welcomes your professional and constructive
      comments on the substance of this product. Feedback that expresses
      different assessments on the topic is especially valuable to the wider
      community discussion. {{ agency }} does not allow discussion of current or
      former US policies, US Persons, or specific/named US entities.
      {{ name }} reserves the right to reject or remove comments that could be
      perceived as offensive, inappropriate, or otherwise taking the focus of
      the discussion away from the substance of the product. {{ name }} may
      forward comments privately rather than making them public. Comment
      functionality on the {{ name }} is not a formal tasking mechanism.
    </p>

    <p class="disclaimer">
      Comments must be at or below the classification of this article and
      appropriately portion marked.
    </p>
    <b-form-group>
      <b-form-textarea
        id="comment-text"
        aria-label="Comments"
        class="w-100 mb-3"
        :maxlength="maxCharacters"
        v-model="comment.body"
      ></b-form-textarea>

      <b-row class="disclaimer">
        <b-col> {{ charactersRemaining }} Characters Remaining </b-col>
      </b-row>
      <b-row>
        <b-col class="pb-4">
          <b-form-checkbox
            class="pt-4 acknowledge-checkbox"
            :class="{ 'text-danger text-bold': !acknowledged }"
            v-model="acknowledged"
            >I acknowledge that my comment is professional in nature and adheres
            to the above commenting guidelines.</b-form-checkbox
          >
        </b-col>
      </b-row>
      <b-row class="disclaimer">
        <b-col cols="7" sm="9">
          <Classify
            aria-label="Comment Classification"
            label="Classification"
            :item-to-classify.sync="commentClassification"
            :dn="currentUser.dn"
            :classification-favorites="[]"
            portionMark
            required
          />
          <div class="sr-only" v-if="!valid">
            Form submission disabled until you have entered some comment text,
            selected the acknowledgement checkbox and classified your comment.
          </div>
        </b-col>
        <b-col cols="17" sm="15" class="pt-4">
          <b-row class="pt-5">
            <b-col class="text-right">
              <b-form-radio-group
                class="pr-2"
                v-model="comment.open"
                buttons
                :options="commentTypeOpts"
                button-variant="outline-dark"
              >
              </b-form-radio-group>
              <b-btn variant="primary" @click="submitComment" :disabled="!valid"
                >Submit</b-btn
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-form-group>
  </span>
</template>

<script>
import Classify from "@shared/Classify";
import axios from "axios";
import { mapGetters, mapState } from "vuex";

export default {
  name: "DocumentCommentForm",
  components: {
    Classify,
  },
  data() {
    return {
      maxCharacters: 4000,
      commentTypeOpts: [
        { text: "Public", value: true },
        { text: "Private", value: false },
      ],
      acknowledged: false,
      commentClassification: this.blankClassification(),
      comment: {},
    };
  },
  mounted() {
    this.resetFormFields();
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapState("metadata", ["agency", "name"]),
    charactersRemaining() {
      let currentLength = this.comment.body ? this.comment.body.length : 0;
      return this.maxCharacters - currentLength;
    },
    linkPath() {
      return `/documents/${this.$route.params["docNum"]}`;
    },
    valid() {
      return (
        this.acknowledged &&
        this.comment.body !== "" &&
        this.commentClassification.classification_xml !== ""
      );
    },
  },
  methods: {
    blankClassification() {
      return { classification_string: "", classification_xml: "" };
    },
    resetFormFields() {
      this.comment = {
        body: "",
        open: true,
        classification: "",
        classification_xml: "",
      };
      this.commentClassification = this.blankClassification();
      this.acknowledged = false;
    },
    submitComment() {
      this.comment.classification = this.commentClassification.classification_string;
      this.comment.classification_xml = this.commentClassification.classification_xml;

      if (this.valid) {
        axios
          .post(this.linkPath + "/comments.json", {
            comment: this.comment,
          })
          .then((response) => {
            if (response.data.success === true) {
              this.$wireNotification({
                title: "Saved Comment",
                duration: 5000,
                text: "Comment successfully saved",
                type: "success",
              });
              this.$emit("commentsUpdated");
              this.resetFormFields();
            } else {
              this.$wireNotification({
                type: "error",
                title: "Error saving comment",
                text: response.data.details,
              });
            }
          })
          .catch((e) => {
            this.$wireNotification({
              type: "error",
              title: "Error saving comment",
              text:
                "Something went wrong while saving your comment. Please try again later",
            });
          });
      }
    },
  },
  watch: {
    $route() {
      this.resetFormFields();
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
textarea {
  height: 200px;
}
.disclaimer {
  color: $alt-800;
  justify-content: left;
  font-size: $font-size-2;
}
.acknowledge-checkbox {
  font-size: $font-size-2;
}
</style>
