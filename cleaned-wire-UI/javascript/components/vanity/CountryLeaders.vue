<template>
  <div>
    <h4>Recently Updated Leadership Profiles</h4>
    <div class="d-flex flex-wrap">
      <LeadershipCard
        v-for="(leader, ind) in first3Leaders"
        :key="ind"
        :leader="leader.document"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LeadershipCard from "./LeadershipCard";
export default {
  name: "CountryLeaders",
  components: { LeadershipCard },
  props: ["country"],

  computed: {
    ...mapState("leadershipProfiles", ["loading", "leadershipProfiles"]),

    first3Leaders() {
      if (this.loading) {
        return null;
      }
      if (this.leadershipProfiles.length > 2) {
        return this.leadershipProfiles.slice(0, 3);
      } else {
        return this.leadershipProfiles;
      }
    },
  },

  methods: {
    ...mapActions("leadershipProfiles", ["getLeadersForCountry"]),
  },

  mounted() {
    this.getLeadersForCountry(this.country.name);
  },
};
</script>

<style scoped></style>
