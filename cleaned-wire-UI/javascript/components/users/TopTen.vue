<template>
  <div class="user-search">
    <h2 class="ten-title mb-6">Top 10 Users by Document Views for Today</h2>

    <div v-if="loading">
      <spinner />
    </div>
    <b-row>
      <b-col
        v-for="(user, index) in topUsers"
        :key="index"
        cols="12"
        :class="`pb-6 ${index % 2 == 0 ? 'pr' : 'pl'}-4`"
      >
        <User
          :user="user.user"
          :additionalDetails="docViewSummary(user)"
          topTen
        />
      </b-col>
      <b-col v-if="topUsers.length === 0">No users found.</b-col>
    </b-row>
  </div>
</template>

<script>
import User from "./User";
import Spinner from "../shared/Spinner";
import { mapGetters } from "vuex";

export default {
  name: "TopTen",
  components: {
    Spinner,
    User,
  },
  mounted() {
    this.loadUsers();
  },
  computed: {
    ...mapGetters("users", ["topUsers"]),
    ...mapGetters("users", ["loading"]),
  },
  methods: {
    loadUsers() {
      this.$store.dispatch("users/loadTopTenUsers", {
        caller: this,
      });
    },
    docViewSummary(user) {
      return `| ${user.total_uniq_docs_viewed} documents viewed (${user.uniq_classified_docs_viewed} classified)`;
    },
  },
};
</script>

<style scoped lang="scss">
.user-search {
  padding-bottom: 6rem;
}
.ten-title {
  font-family: $heading-stylized;
  color: $pri-900;
  font-size: $font-size-7;
  border-bottom: 1px solid $alt-400;
  padding-bottom: 1rem;
}
.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid $pri-300;
  box-shadow: 0 3px 1px $pri-100;
  border-radius: unset;

  &:hover,
  &.focused {
    box-shadow: 0 5px 2px $pri-200;
  }
}
</style>
