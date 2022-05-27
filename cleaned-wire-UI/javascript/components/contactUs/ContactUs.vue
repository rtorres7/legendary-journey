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
            <h2 class="form-title">Reach Out</h2>
          </b-row>
          <p class="mb-6">
            For questions or support please fill out the form below and our
            support team will reach out within 24-48 hours.
          </p>
          <div
            v-if="this.loading"
            class="d-flex justify-content-center align-items-center loading-area"
          >
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
                  aria-label="Contact Email"
                  label="Email"
                  invalid-feedback="Contact Email is required."
                >
                  <b-input
                    v-model="$v.feedback.email.$model"
                    :state="notBlank($v.feedback.email)"
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
                  aria-label="Contact Phone Number"
                  label="Phone"
                >
                  <b-input v-model="feedback.phone" />
                </b-form-group>
              </b-col>
              <b-col class="pr-4 pb-4" cols="24">
                <b-form-group
                  class="label"
                  label="Comments"
                  aria-live="polite"
                  invalid-feedback="Comment cannot be blank."
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
                    <b-btn variant="primary" type="submit">Submit</b-btn>
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
import SelectAll from "../selectWithinResults/SelectAll";
import { capitalize } from "lodash";
import Classify from "@shared/Classify";
import ContactUsDetailsCiawire from "./ContactUsDetailsCiawire";
import ContactUsResourcesCiawire from "./ContactUsResourcesCiawire";
import ContactUsDetailsBluekey from "./ContactUsDetailsBluekey";
import ContactUsResourcesBluekey from "./ContactUsResourcesBluekey";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "ContactUs",
  mixins: [validationMixin],
  components: {
    SelectAll,
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
        email: "",
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
  },
  validations: {
    feedback: {
      comment: {
        required,
      },
      email: {
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
          email: this.feedback.email,
          organization: this.feedback.organization,
          phone: this.feedback.phone,
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
      this.feedback.email = this.currentUser.email;
      this.feedback.phone = this.currentUser.phone_number;
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
