<template>
  <div class="mr-7 mt-6">
    <div class="d-flex separator">
      <b-btn
        v-b-toggle="'feed-form-' + feed.id"
        class="feed-title pl-0"
        variant="link"
      >
        {{ feed.title }} <span class="sr-only"> feed</span>
        <span v-if="feed.default" class="default-feed">(Default)</span>
      </b-btn>

      <div class="d-flex align-items-center ml-auto">
        <DeleteButtonBase
          :label="feed.title"
          type="feed"
          @deleteButtonEvent="onDelete"
        />
      </div>
    </div>

    <b-collapse :id="'feed-form-' + feed.id" accordion="feed-accordion">
      <b-form @submit="onSubmit">
        <div class="d-flex justify-content-end">
          <b-btn variant="link" type="submit" :disabled="$v.$invalid">
            Update
          </b-btn>
        </div>
        <b-form-group
          label="Title"
          label-for="title"
          invalid-feedback="Cannot be blank"
        >
          <b-input
            id="title"
            aria-label="Feed Title"
            :state="notBlank($v.currentFeed.title)"
            v-model="$v.currentFeed.title.$model"
          />
        </b-form-group>
        <b-form-group
          label="_temp_1"
          label-for="_temp_1"
          invalid-feedback="Cannot be blank"
        >
          <b-input
            id="_temp_1"
            aria-label="Feed _temp_1"
            :state="notBlank($v.currentFeed._temp_1)"
            v-model="$v.currentFeed._temp_1.$model"
          />
        </b-form-group>
        <b-form-checkbox class="mt-3 mb-3" v-model="currentFeed.default">
          Default Feed
        </b-form-checkbox>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import DeleteButtonBase from "../../shared/DeleteButtonBase";

export default {
  name: "Feed",
  components: { DeleteButtonBase },
  mixins: [validationMixin],
  props: ["feed"],
  data() {
    return {
      currentFeed: {
        id: "",
        title: "",
        _temp_1: "",
        default: "",
      },
    };
  },
  validations: {
    currentFeed: {
      title: {
        required,
      },
      _temp_1: {
        required,
      },
    },
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch("feeds/updateRecommendedFeed", {
        feed: this.currentFeed,
        caller: this,
      });
    },
    onDelete(evt) {
      this.$store.dispatch("feeds/deleteRecommendedFeed", {
        feed: this.currentFeed,
        caller: this,
      });
    },
    notBlank(item) {
      const { $dirty, $error } = item;
      return $dirty ? !$error : null;
    },
  },
  created() {
    this.currentFeed = Object.assign({}, this.feed);
    this.$nextTick(() => {
      this.$v.$touch();
    });
  },
};
</script>

<style scoped lang="scss">
.feed-title {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
.default-feed {
  font-family: "Roboto Condensed";
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}

img.edit-icon {
  height: 16px;
  width: 16px;
}
</style>
