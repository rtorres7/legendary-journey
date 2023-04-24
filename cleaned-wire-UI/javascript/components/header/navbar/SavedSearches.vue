<template>
  <b-nav-item-dropdown
    ref="dropdown"
    text="Your Searches"
    data-usage="saved-searches"
  >
    <template v-if="!loading && hasSearches">
      <SavedSearch
        v-for="(search, ind) in savedSearches.search"
        :key="ind"
        :loading="loading"
        :dropdown="$refs.dropdown"
        :search="search"
      ></SavedSearch>
    </template>
    <div v-if="!loading && !hasSearches" class="p-5 no-saved-search">
      You have no saved searches.
    </div>
    <spinner label="Spinning" v-if="loading"></spinner>
  </b-nav-item-dropdown>
</template>

<script>
import SavedSearch from "./SavedSearch";
import Spinner from "@shared/Spinner";
import { isEmpty } from "lodash";
import { mapState } from "vuex";

export default {
  name: "SavedSearches",
  components: { Spinner, SavedSearch },
  computed: {
    ...mapState("savedSearches", ["savedSearches", "loading"]),

    hasSearches() {
      return !isEmpty(this.savedSearches.search);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .dropdown-menu {
  height: auto;
  max-height: 500px;
  overflow-y: scroll;
}
::v-deep .btn-link {
  color: $dropdown-link-color;
}
</style>
