<template>
  <div class="pt-8">
    <h2 class="pri-800 separator pb-4">Tags</h2>
    <p v-if="tags.length === 0">This document has not been tagged.</p>
    <b-form-group>
      <router-link v-for="(tag, i) in tags" :to="`/tags/${tag}`" :key="i">
        {{ i !== tags.length - 1 ? `${tag}, ` : tag }}
      </router-link>
      <div class="text-right">
        <b-btn variant="secondary" v-b-modal.tag-article>Add Tag</b-btn>
      </div>
    </b-form-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DocumentTags",
  mounted() {
    this.retrieveTags();
  },
  computed: {
    ...mapState("document", ["tags"]),
  },
  methods: {
    retrieveTags() {
      this.$store.dispatch("document/retrieveTags", {
        docNum: this.$route.params["docNum"],
      });
    },
  },
  watch: {
    $route() {
      this.retrieveTags();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}

::v-deep li {
  list-style: none;
}
</style>
