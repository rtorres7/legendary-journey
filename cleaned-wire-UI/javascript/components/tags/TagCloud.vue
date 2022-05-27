<template>
  <div class="mt-6 pb-8 tag-cloud">
    <h2>All WIRe Tags</h2>
    <b-form @submit="onSubmit">
      <b-form-group id="tag-name" label-for="tag-name-input">
        <label>Search for a tag</label>
        <b-input id="tag-name-input" class="mb-3" v-model="tagNameInput">
        </b-input>
        <b-form-invalid-feedback id="new-tag-live-feedback" aria-live="polite">
          Enter a new tag, at least 3 characters.
        </b-form-invalid-feedback>
        <b-btn class="mb-3" variant="primary" type="submit">Search</b-btn>
        <b-btn class="mb-3" variant="secondary" to="/tags"
          >Browse all WIRe Tags</b-btn
        >
      </b-form-group>
    </b-form>
    <div class="separator"></div>
    <div class="mt-5">
      Below is a list of the top tags used by WIRe readers over the last six
      months. The darker the tag appears, the more popular it is.
    </div>
    <div class="mt-5">
      <b-btn
        :to="'/tags/' + tag.name"
        :class="'mt-3 ml-2 ' + tag.tag_bucket"
        v-for="tag in top_tags"
        :key="tag.name"
      >
        {{ tag.name }}
      </b-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagCloud",
  props: {
    top_tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tagNameInput: "",
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      // call store/backend
      this.$store.dispatch("tags/searchTag", {
        tagName: this.tagNameInput,
        caller: this,
      });
      let query = { text: this.tagNameInput };
      this.$router.push({ name: "searchTags", query: query });
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.tag-cloud {
  @media (max-width: $screen-lg) {
    padding-bottom: 7rem;
  }
}
.least-used {
  background-color: $pri-100;
}
.somewhat-used {
  background-color: $pri-300;
}
.used {
  background-color: $pri-500;
  color: white;
}
.most-used {
  background-color: $pri-700;
  color: white;
}
.used-a-ton {
  background-color: $pri-900;
  color: white;
}
</style>
