<template>
  <div class="mt-6" id="user_search_results">
    <div v-if="processing">
      <spinner label="Spinning" />
    </div>

    <h2 v-if="!processing && containsQuery" class="user-title mb-6 pt-8">
      Results
    </h2>
    <div v-if="!processing && users.users.length > 0">
      <div class="sr-only">{{ users.users.length }} results found</div>
      <b-row>
        <b-col
          v-for="(user, index) in users.users"
          :key="index"
          cols="12"
          :class="`pb-6 ${index % 2 == 0 ? 'pr' : 'pl'}-4`"
        >
          <User :user="user" />
        </b-col>
      </b-row>

      <div class="overflow-auto text-center mt-5" v-if="users.pages > 1">
        <div class="d-flex justify-content-center">
          <b-pagination-nav
            :link-gen="paginationLink"
            :number-of-pages="users.pages"
            @change="$emit('findUsers')"
          ></b-pagination-nav>
        </div>
      </div>
    </div>
    <div v-if="!processing && users.users.length === 0 && containsQuery">
      No users found.
    </div>
  </div>
</template>

<script>
import User from "./User";
import Spinner from "../shared/Spinner";
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";

export default {
  name: "UserSearchResults",
  components: {
    Spinner,
    User,
  },

  mounted() {},
  computed: {
    ...mapGetters("users", ["processing"]),
    ...mapGetters("users", ["users"]),
    containsQuery() {
      return !isEmpty(this.$route.query);
    },
  },
  watch: {
    users() {
      // keep focus on select _temp_20 button
      if (!this.processing && this.users.users.length > 0) {
        this.$nextTick(() => {
          document.querySelector("#user_search_results a").focus();
        });
      }
    },
  },
  methods: {
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
    },
  },
};
</script>

<style scoped lang="scss">
#user_search_results {
  padding-bottom: 6rem;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.user-title {
  font-family: $heading-stylized;
  color: $pri-900;
  font-size: $font-size-7 !important;
  border-bottom: 1px solid $alt-400;
  padding-bottom: 1rem;
}
</style>
