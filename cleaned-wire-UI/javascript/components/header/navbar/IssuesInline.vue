<template>
  <div v-if="!loading">
    <b-dropdown-header> Issues </b-dropdown-header>
    <Issue v-for="(issue, ind) in issues" :key="ind" :display="issue.name" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Issue from "./Issue";
export default {
  name: "IssuesInline",
  components: { Issue },
  computed: {
    ...mapState("metadata/criteria/issues", { issues: "values" }),
    ...mapState("metadata/criteria", ["loading"]),
  },
};
</script>

<style scoped>
>>> .dropdown-menu {
  width: 570px;
}
</style>
