<template>
  <div v-if="agency" class="standard-page-margin mb-5">
    <h1 class="mt-5">Accessibility on {{ this.agency }} {{ this.name }}</h1>
    {{ this.agency }} {{ this.name }} has been built to provide the most
    consistent user experience possible for all users. If you are using a screen
    reader, then we recommend using either Chrome or Firefox for the best user
    experience.
    <p>
      {{ this.agency }} {{ this.name }}
      would like to hear your feedback on how we're doing in meeting the
      accessibility objectives:
      <router-link to="/feedback">Feedback</router-link>
    </p>
    <b-row class="pb-8">
      <b-col class="mr-7 pb-8"><DatePicker /></b-col>
      <b-col><Shortcuts /></b-col>

      <OmniSearch />
      <KnownIssues />
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Shortcuts from "./Shortcuts";
import DatePicker from "./DatePicker";
import OmniSearch from "./OmniSearch";
import KnownIssues from "./KnownIssues";
export default {
  name: "Accessibility",
  components: {
    KnownIssues,
    OmniSearch,
    DatePicker,
    Shortcuts,
  },
  computed: {
    ...mapState("metadata", ["agency", "name"]),
  },
};
</script>

<style scoped lang="scss"></style>
