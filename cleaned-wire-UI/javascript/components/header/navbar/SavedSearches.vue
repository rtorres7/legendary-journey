<template>
  <b-nav-item-dropdown
    ref="dropdown"
    text="Your Searches"
    data-usage="saved-searches"
  >
    <SavedSearch
      v-for="(search, ind) in savedSearches.search"
      :key="ind"
      v-if="!loading && hasSearches"
      :loading="loading"
      :dropdown="$refs.dropdown"
      :search="search"
    ></SavedSearch>
    <div v-if="!loading && !hasSearches" class="p-5">
      You have no saved searches.
    </div>
    <spinner label="Spinning" v-if="loading"></spinner>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from "vuex";
import SavedSearch from "./savedSearches/SavedSearch";
import Spinner from "../../shared/Spinner";

export default {
  name: "SavedSearches",
  components: { Spinner, SavedSearch },
  computed: {
    ...mapState("savedSearches", ["savedSearches", "loading"]),

    hasSearches() {
      return !_.isEmpty(this.savedSearches);
    },
  },
};
</script>

<style scoped>
/deep/ .dropdown-menu {
  height: auto;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
