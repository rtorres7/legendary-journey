<template>
  <div class="mt-6 feedback">
    <div class="mt-6 standard-page-margin feedback">
      <vanity-title title="Contact Us"></vanity-title>
    </div>
    <div>
      <component v-if="project" :is="`ContactUsDetails${capitalizedProject}`" />
      <b-row class="standard-page-margin">
        <b-col class="mb-8">
          <b-row class="d-flex justify-content-start separator mt-6 mb-4">
            <h2 class="form-title">Questions and Concerns</h2>
          </b-row>
          <p class="mb-6">
            For any other questions, please complete the form below, and our
            support team will reach out within one or two business days.
          </p>
          <div v-if="this.loading">
            <spinner />
          </div>
          <b-form v-else @submit.prevent="onSubmit">
            <b-row class="mb-4">
              <b-col class="pr-4 pb-4" cols="12">
                <b-form-group
                  class="label"
                  aria-label="Contact Name"
                  label="Name"
                >
                  <b-input v-model="feedback.name"></b-input>
                </b-form-group>
              </b-col>
              <b-col class="pr-4 pb-4" cols="12">
                <b-form-group
                  class="label"
                  aria-label="Contact _temp_37"
                  label="_temp_37"
                  invalid-feedback="Contact _temp_37 is required."
                >
                  <b-input
                    v-model="$v.feedback._temp_37.$model"
                    :state="notBlank($v.feedback._temp_37)"
                  />
                </b-form-group>
              </b-col>
              <b-col class="pr-4 pb-4" cols="12">
                <b-form-group
                  class="label"
                  aria-label="Contact Organization"
                  label="Organization"
                >
                  <b-input :value="feedback.organization" />
                </b-form-group>
              </b-col>
              <b-col class="pr-4 pb-4" cols="12">
                <b-form-group
                  class="label"
                  aria-label="Contact _temp_36 Number"
                  label="_temp_36"
                >
                  <b-input v-model="feedback._temp_36" />
                </b-form-group>
              </b-col>
              <b-col class="pr-4 pb-4" cols="24">
                <b-form-group
                  class="label"
                  label="Comments"
                  aria-live="polite"
                  :invalid-feedback="invalidFeedback"
                >
                  <b-form-textarea
                    aria-label="Comment text, cannot be blank"
                    aria-live="polite"
                    :state="notBlank($v.feedback.comment)"
                    v-model="$v.feedback.comment.$model"
                    ref="commentText"
                    class="form-control"
                    rows="8"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>

              <b-col class="pr-4 pb-4">
                <b-row>
                  <b-col>
                    <b-form-group
                      class="label"
                      aria-label="Comment Classification"
                      label="Classification"
                      invalid-feedback="Classification is required."
                    >
                      <Classify
                        :item-to-classify.sync="commentClassification"
                        :dn="currentUser.dn"
                        :classification-favorites="[]"
                        @new-classification-favorite="addClassificationFavorite"
                        required
                      />
                    </b-form-group>
                  </b-col>
                  <b-col class="ml-auto justify-content-end" cols="auto">
                    <b-btn
                      variant="primary"
                      type="submit"
                      :disabled="$v.$invalid"
                      >Submit</b-btn
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <component
          v-if="project"
          :is="`ContactUsResources${capitalizedProject}`"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import Classify from "@shared/Classify";
import ContactUsDetailsCiawire from "./ContactUsDetailsCiawire";
import ContactUsResourcesCiawire from "./ContactUsResourcesCiawire";
import ContactUsDetailsBluekey from "./ContactUsDetailsBluekey";
import ContactUsResourcesBluekey from "./ContactUsResourcesBluekey";
import axios from "axios";
import { capitalize } from "lodash";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapGetters, mapState } from "vuex";

export default {
  name: "ContactUs",
  mixins: [validationMixin],
  components: {
    VanityTitle,
    Spinner,
    Classify,
    ContactUsDetailsCiawire,
    ContactUsDetailsBluekey,
    ContactUsResourcesCiawire,
    ContactUsResourcesBluekey,
  },
  data() {
    return {
      commentClassification: this.blankClassification(),
      feedback: {
        _temp_37: "",
        comment: "",
      },
    };
  },
  created() {
    this.loadFeedback();
    this.$nextTick(() => {
      this.$v.$touch();
    });
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapGetters("user", ["loading"]),
    ...mapState("metadata", ["project"]),
    capitalizedProject() {
      return capitalize(this.project);
    },
    commentMaxLength() {
      return this.$v.feedback.comment.$params.maxLength.max;
    },
    invalidFeedback() {
      if (this.feedback.comment.length > this.commentMaxLength) {
        return `Comment cannot exceed ${this.commentMaxLength} characters.`;
      }
      if (this.feedback.comment.length === 0) {
        return "Comment cannot be blank.";
      }
    },
  },
  validations: {
    feedback: {
      comment: {
        required,
        maxLength: maxLength(4000),
      },
      _temp_37: {
        required,
      },
    },
    commentClassification: {
      classification_string: {
        required,
      },
      classification_xml: {
        required,
      },
    },
  },
  methods: {
    notBlank(item) {
      const { $dirty, $error } = item;
      return $dirty ? !$error : null;
    },
    blankClassification() {
      return { classification_string: "", classification_xml: "" };
    },
    reloadForm() {
      this.feedback.comment = "";
      this.commentClassification = this.blankClassification();
    },
    setFocus() {
      this.$refs.commentText.focus();
    },
    onSubmit(evt) {
      axios
        .post("/feedback", {
          body: this.feedback.comment,
          name: this.feedback.name,
          _temp_37: this.feedback._temp_37,
          organization: this.feedback.organization,
          _temp_36: this.feedback._temp_36,
          classification: this.commentClassification.classification_string,
          classification_xml: this.commentClassification.classification_xml,
          priority: 0,
        })
        .then((response) => {
          if (response.data.success) {
            this.$wireNotification({
              title: "Contact Us",
              duration: 5000,
              text: "Thank you! Your feedback has been successfully received.",
              type: "success",
            });
            setTimeout(() => {
              this.reloadForm();
              this.setFocus();
            }, 1000);
          } else {
            this.$wireNotification({
              title: "Contact Us",
              duration: 5000,
              text: response.data.error,
              type: "error",
            });
          }
        })
        .catch(() => {
          throw new Error("Error creating feedback");
        });
    },
    addClassificationFavorite(newFav) {
      // future feature
      // deal with added favorite here.
      // { name: "", classification_string: "". classification_xml: ""}
    },
    loadFeedback() {
      this.feedback.name = this.currentUser.name;
      this.feedback._temp_37 = this.currentUser._temp_37;
      this.feedback._temp_36 = this.currentUser.phone_number;
      this.feedback.organization = this.currentUser.organization;
    },
  },
  watch: {
    currentUser() {
      this.loadFeedback();
    },
  },
};
</script>
<style scoped lang="scss">
.form-title {
  color: $pri-600;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
