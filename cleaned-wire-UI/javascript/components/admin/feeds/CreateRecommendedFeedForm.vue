<template>
  <div :class="showHeader ? 'mt-6' : ''">
    <h2 v-if="showHeader">Create a Feed</h2>
    <b-form @submit="onSubmit">
      <b-row class="mt-6 mb-0" align-v="start">
        <b-form-group
          class="mb-1 w-100"
          label="Feed Title"
          label-for="title"
          invalid-feedback="Cannot be blank"
        >
          <b-input
            id="title"
            aria-label="Feed Title"
            :state="notBlank($v.feed.title)"
            v-model="$v.feed.title.$model"
            autofocus
          />
        </b-form-group>
        <b-form-group
          class="mb-1 w-100"
          label="_temp_1"
          label-for="_temp_1"
          invalid-feedback="Cannot be blank"
        >
          <b-input
            id="_temp_1"
            aria-label="Fully Qualified _temp_1"
            :state="notBlank($v.feed._temp_1)"
            v-model="$v.feed._temp_1.$model"
          />
        </b-form-group>
        <b-form-checkbox id="default-feed" class="mt-3" v-model="feed.default">
          Make Default Feed
        </b-form-checkbox>
      </b-row>
      <b-btn
        class="mt-4"
        variant="primary"
        type="submit"
        :disabled="$v.$invalid"
        >Add Feed
      </b-btn>
    </b-form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "CreateRecommendedFeedForm",
  mixins: [validationMixin],
  data() {
    return {
      feed: {
        title: "",
        _temp_1: "",
        default: false,
      },
    };
  },
  validations: {
    feed: {
      title: {
        required,
      },
      _temp_1: {
        required,
      },
    },
  },
  props: {
    showHeader: {
      default: true,
    },
    label: {
      default: "Enter feed name",
    },
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      this.$store
        .dispatch("feeds/createRecommendedFeed", {
          feed: this.feed,
          caller: this,
        })
        .then(() => {
          this.feed.title = "";
          this.feed._temp_1 = "";
          this.feed.default = false;
        });
    },
    notBlank(formInput) {
      const { $dirty, $error } = formInput;
      return $dirty ? !$error : null;
    },
  },
};
</script>

<style scoped lang="scss">
button[type="submit"] {
  margin-top: 1.8rem;
}
</style>
