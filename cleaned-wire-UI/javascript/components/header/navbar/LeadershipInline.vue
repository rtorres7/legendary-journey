<template>
  <div>
    <b-dropdown-header> Leadership </b-dropdown-header>
    <LeadershipLinks />
  </div>
</template>

<script>
import LeadershipLinks from "./LeadershipLinks";
export default {
  name: "LeadershipInline",
  components: { LeadershipLinks },
};
</script>

<style scoped lang="scss"></style>
