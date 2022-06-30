<template>
  <div>
    <b-form-group label="Select one of the saved searches to preview">
      <b-form-radio
        v-model="form.search_id"
        v-for="(savedSearch, ind) in savedSearches.search"
        :key="ind"
        ref="search"
        :name="savedSearch.search_name"
        :value="savedSearch.id"
      >
        {{ savedSearch.search_name }}
      </b-form-radio>
    </b-form-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Preview from "./Preview";

export default {
  name: "SavedSearchesPortlet",
  props: ["form"],
  components: { Preview },
  computed: {
    ...mapState("savedSearches", ["savedSearches"]),
  },

  mounted() {
    this.$nextTick(function () {
      this.$refs.search[0].$el.children[0].focus();
    });
  },
};
</script>

<style scoped></style>
