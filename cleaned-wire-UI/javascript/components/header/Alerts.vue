<template>
  <div class="alerts-banner alert-warning">
    <b-alert
      v-for="(alert, ind) in undismissedAlerts"
      :key="ind"
      show
      dismissible
      dismiss-label="System alert close"
      @dismissed="storeDismissedAlertInCookie(alert.id, alert.expiresIn)"
      variant="warning"
      class="standard-page-margin mb-0 border-0 rounded-0 pr-8"
    >
      <AlertIcon type="announcement" />
      <strong class="mr-2">{{ alert.title }}</strong>

      <!--needs to be v-html so CM team can put links in here -->
      <span v-html="alert.message"></span>
    </b-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reject } from "lodash";
import AlertIcon from "@shared/AlertIcon";

export default {
  name: "Alerts",
  components: { AlertIcon },
  computed: {
    ...mapState("alerts", ["alerts", "loading"]),
    undismissedAlerts() {
      return reject(this.alerts, function (alert) {
        return $cookies.get("alert_" + alert.id);
      });
    },
  },
  methods: {
    storeDismissedAlertInCookie(alertId, expiresIn) {
      this.$cookies.set("alert_" + alertId, true, expiresIn);
    },
  },
};
</script>
