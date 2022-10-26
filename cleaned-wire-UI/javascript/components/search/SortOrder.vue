<template>
  <b-dropdown variant="link" :text="'Sort by ' + selected">
    <b-dropdown-item
      v-for="(option, ind) in searchOrderOpts"
      @click="setSortOrder(option.value)"
      :key="ind"
      :value="option.value"
    >
      {{ option.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { upperFirst } from "lodash";

export default {
  name: "SortOrder",
  data() {
    return {
      selected: this.getSortOrder(),
      searchOrderOpts: [
        { text: "Newest", value: "newest" },
        { text: "Oldest", value: "oldest" },
        { text: "Relevance", value: "relevance" },
      ],
    };
  },
  methods: {
    getSortOrder() {
      let query = Object.assign({}, this.$route.query);
      if (query["sort_dir"] === "asc") {
        return "Oldest";
      } else if (query["sort_field"] === "score") {
        return "Relevance";
      } else {
        return "Newest";
      }
    },
    setSortOrder(value) {
      var query = this.clearSearchOrder();
      if (value == "oldest") {
        query["sort_dir"] = "asc";
      } else if (value == "relevance") {
        query["sort_field"] = "score";
      } else {
        query["sort_dir"] = "desc";
      }
      this.$router.push({
        name: this.$route.name,
        query,
      });
      this.selected = upperFirst(value);
      this.$store.dispatch("search/search", this.$route);
    },
    clearSearchOrder() {
      let query = Object.assign({}, this.$route.query);
      delete query.sort_dir;
      delete query.sort_field;
      return query;
    },
  },
};
</script>
