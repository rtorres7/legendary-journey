<template>
  <div class="security-_temp_519 pri-600-bg">
    <div>
      <b-alert
        :show="unacknowledgedToday"
        class="standard-page-margin pri-600-bg white security-_temp_519 pr-8 py-1 mb-0 border-0 text-center"
        dismissible
        fade
        dismiss-label="Security _temp_519 close"
        @dismissed="updateDismissed"
      >
        Use of this U.S. Government system, authorized or unauthorized,
        constitutes consent to monitoring, recording, and/or auditing.
        Unauthorized use is prohibited and subject to criminal and civil
        penalties. Be cognizant of both classification and dissemination
        controls that are associated with each specific
        {{ this.agency }} {{ this.name }} document that is extracted for
        downstream distribution. Contact the
        <a class="contact-link" :href="`mailto:${contactEmail}`"
          >{{ this.agency }} {{ this.name }} team</a
        >
        for any handling concerns.
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SecurityBanner",
  computed: {
    ...mapState("metadata", ["agency", "contactEmail", "name"]),
    unacknowledgedToday() {
      var date = localStorage.getItem("acknowledgement_date"); // Returns null if the token is not present
      return !date || date != new Date().toDateString();
    },
  },
  methods: {
    updateDismissed() {
      localStorage.setItem("acknowledgement_date", new Date().toDateString());
    },
  },
};
</script>

<style scoped lang="scss">
.contact-link {
  text-decoration: underline;
  color: $text-light;
}
::v-deep .close {
  color: white;
  text-shadow: none;
  opacity: 100;
}
</style>
