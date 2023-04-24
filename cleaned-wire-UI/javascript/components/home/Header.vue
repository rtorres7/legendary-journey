<template>
  <div class="d-flex mb-3">
    <DatePicker />
    <Subscribe
      v-if="!loading && !restricted && featuresAvailable.frontPageSubscribe"
    />
    <UserFrontPageOptions />
  </div>
</template>

<script>
import DatePicker from "@shared/DatePicker";
import Subscribe from "@shared/Subscribe";
import UserFrontPageOptions from "@shared/UserFrontPageOptions";
import { mapState } from "vuex";
export default {
  name: "Header",
  components: { UserFrontPageOptions, Subscribe, DatePicker },
  computed: {
    ...mapState("user", ["user", "loading"]),
    ...mapState("metadata", ["featuresAvailable"]),
    restricted() {
      return this.user.congress;
    },
  },
};
</script>

<style scoped></style>
