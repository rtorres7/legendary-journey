<template>
  <b-dropdown-item :to="link" :data-usage="dataUsage">{{
    display
  }}</b-dropdown-item>
</template>

<script>
export default {
  name: "Issue",
  props: ["display"],
  computed: {
    link() {
      return "/issues/" + this.display;
    },
    dataUsage() {
      // returns something similar to nav-issues-issue-terrorism-homeland-security
      return _.kebabCase("nav-issues-issue" + this.display);
    },
  },
};
</script>

<style scoped></style>
