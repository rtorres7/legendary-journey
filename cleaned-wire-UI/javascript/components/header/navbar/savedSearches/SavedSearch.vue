<template>
  <div v-if="project" class="d-flex align-items-center">
    <b-dropdown-item
      v-if="!loading && !confirm"
      class="flex-grow-1"
      :to="`/search?${search.url}&id=${search.id}`"
    >
      {{ search.search_name }}
    </b-dropdown-item>
    <b-button
      class="mx-3 my-2"
      size="sm"
      variant="outline"
      v-if="!confirm"
      @click.stop.prevent
      @click="askForConfirm"
      :aria-label="'Delete saved search: ' + search.search_name"
    >
      <img
        :src="require(`../../../../assets/${project}-nav-reset.svg`)"
        class="nav-reset-icon mr-1"
        alt="Reset"
      />
    </b-button>
    <b-button
      :disabled="confirmClicked"
      class="confirm-delete ml-auto"
      size="sm"
      v-if="confirm"
      variant="danger"
      @click="deleteSearch"
    >
      Confirm delete of {{ search.search_name }}
    </b-button>
    <b-button
      class="mx-3"
      size="sm"
      v-if="confirm"
      variant="link"
      @click="confirm = false"
    >
      Cancel
    </b-button>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "SavedSearch",
  computed: {
    ...mapState("metadata", ["project"]),
  },
  props: ["search", "loading", "dropdown"],
  data() {
    return {
      confirm: false,
      confirmClicked: false,
    };
  },

  methods: {
    deleteSearch() {
      this.confirmClicked = true;
      axios.delete("/search/" + this.search.id).then(() => {
        this.$wireNotification({
          group: "main",
          title: "Search Deleted",
          duration: 5000,
          text: this.search.search_name + " deleted",
          type: "success",
        });
        this.dropdown.hide(true);
        this.$store.dispatch("savedSearches/loadSavedSearches");
        this.$store.dispatch("portlets/loadPortlets");
      });
    },

    askForConfirm() {
      this.confirm = true;
    },
  },
};
</script>

<style scoped lang="scss">
.confirm-delete {
  min-width: 200px;
}

.nav-reset-icon {
  height: 16px;
  width: 16px;
}
</style>
