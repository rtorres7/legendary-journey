<template>
  <b-nav-item-dropdown id="nav_issues" text="Issues">
    <div v-if="!loading" class="d-flex flex-column flex-md-row">
      <div>
        <Issue
          v-for="(issue, ind) in issues.slice(0, 5)"
          :key="ind"
          :display="issue.name"
        />
      </div>
      <div>
        <Issue
          v-for="(issue, ind) in issues.slice(5, issues.length)"
          :key="ind"
          :display="issue.name"
        />
      </div>
    </div>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from "vuex";
import Issue from "./Issue";
export default {
  name: "Issues",
  components: { Issue },
  computed: {
    ...mapState("metadata/criteria/issues", { issues: "values" }),
    ...mapState("metadata/criteria", ["loading"]),
  },
};
</script>

<style scoped>
.dropdown-menu {
  width: 500px;
}
</style>
