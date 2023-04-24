<template>
  <div>
    <b-nav-item
      v-if="!user.loading && restricted"
      :to="leadershipLinks.cia_leadership_profiles._temp_1"
      data-usage="nav-front-page"
    >
      <div class="d-flex">
        <div>Leadership</div>
      </div>
    </b-nav-item>
    <b-nav-item-dropdown v-else id="nav-leadership" text="Leadership">
      <LeadershipLinks />
    </b-nav-item-dropdown>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LeadershipLinks from "./LeadershipLinks";
export default {
  name: "Leadership",
  components: { LeadershipLinks },
  computed: {
    ...mapState("leadershipLinks", ["leadershipLinks", "loading"]),
    ...mapState("user", ["user", "loading"]),
    restricted() {
      return this.user.congress;
    },
  },
};
</script>
