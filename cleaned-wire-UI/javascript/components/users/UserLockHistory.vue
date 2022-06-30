<template>
  <div>
    <h2 class="info-title d-flex separator mt-8 pb-2">Lock History</h2>
    <div
      v-if="processing"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      <spinner />
    </div>
    <p
      v-for="(event, index) in userLockHistory"
      :key="event.id"
      class="mt-3 event-details"
    >
      <span class="event-title">
        {{ event.action }} on {{ formattedDate(event.created_at) }}
      </span>
      (by {{ event.actor }}) <br />
      <span v-if="event.expires_on || event.permanent">
        Duration: <label class="pt-2">{{ duration(event) }}</label
        ><br />
      </span>
      <span
        >Reason: <label>{{ event.reason }}</label></span
      >
    </p>
    <p v-if="userLockHistory.length === 0">
      {{ user.name }} has not been locked
    </p>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";
import { mapGetters } from "vuex";

export default {
  name: "UserLockHistory",
  components: {
    Spinner,
  },
  computed: {
    ...mapGetters("users", ["processing"]),
    ...mapGetters("users", ["user"]),
    ...mapGetters("users", ["userLockHistory"]),
  },
  methods: {
    formattedDate(value) {
      if (value) {
        return this.$moment(value).format("MMMM DD, YYYY HH:mm");
      }
    },
    duration(event) {
      return event.permanent
        ? "Permanent"
        : this.$moment(event.expires_on).format("MMMM DD, YYYY");
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
}
.event-title {
  color: $pri-600;
  font-size: $font-size-3;
  font-family: $heading-stylized;
  background-color: white;
}
</style>
