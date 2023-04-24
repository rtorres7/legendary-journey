<template>
  <div>
    <b-dropdown-item
      v-if="!loading"
      :to="leadershipLinks.cia_leadership_profiles._temp_1"
      :data-usage="dataUsage(leadershipLinks.cia_leadership_profiles.display)"
    >
      {{ leadershipLinks.cia_leadership_profiles.display }}
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!loading"
      :to="leadershipLinks.cia_extremist_profiles._temp_1"
      :data-usage="dataUsage(leadershipLinks.cia_extremist_profiles.display)"
    >
      {{ leadershipLinks.cia_extremist_profiles.display }}
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!loading"
      :to="leadershipLinks.cia_med_psych_profiles._temp_1"
      :data-usage="dataUsage(leadershipLinks.cia_med_psych_profiles.display)"
    >
      {{ leadershipLinks.cia_med_psych_profiles.display }}
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!loading"
      :href="leadershipLinks.dia_leadership_profiles._temp_1"
      :data-usage="dataUsage(leadershipLinks.dia_leadership_profiles.display)"
      target="_blank"
    >
      {{ leadershipLinks.dia_leadership_profiles.display }}
    </b-dropdown-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { kebabCase } from "lodash";

export default {
  name: "LeadershipLinks",
  mounted() {
    this.$store.dispatch("leadershipLinks/loadLeadershipLinks", {
      caller: this,
    });
  },
  methods: {
    dataUsage(linkDisplay) {
      return kebabCase("nav-leadership" + linkDisplay);
    },
  },
  computed: {
    ...mapState("leadershipLinks", ["leadershipLinks", "loading"]),
  },
};
</script>

<style scoped></style>
