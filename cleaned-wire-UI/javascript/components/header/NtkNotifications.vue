<template>
  <div
    v-if="!this.loading && this.notificationActive"
    id="ntk_advert"
    class="alerts-banner"
    :class="'alert-' + ntkNotification.type"
  >
    <b-alert
      v-if="ntkNotification"
      show
      fade
      :dismissible="ntkNotification.dismissible"
      dismiss-label="Ntk notification close"
      @dismissed="storeDismissedNotificationInCookie()"
      :variant="ntkNotification.type"
      class="standard-page-margin mb-0 border-0 rounded-0 px-0"
    >
      <!--needs to be v-html so CM team can put links in here -->
      <AlertIcon :type="ntkNotification.type" />
      <span v-html="ntkNotification.msg"></span>
    </b-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AlertIcon from "@shared/AlertIcon";

export default {
  name: "NtkNotifications",
  components: { AlertIcon },
  computed: {
    ...mapState("user", ["user", "loading"]),

    ntkNotification() {
      if (!this.loading) {
        return this.user.notifications.ntk;
      }
    },
    notificationActive() {
      return !_.isEmpty(this.ntkNotification) && !$cookies.get(this.cookieText);
    },
    cookieText() {
      return (
        "ignore_" +
        this.ntkNotification.state +
        "_ntk_advert=" +
        this.ntkNotification.id
      );
    },
  },
  methods: {
    storeDismissedNotificationInCookie() {
      this.$cookies.set(this.cookieText, true, this.ntkNotification.expiresIn);
    },
  },
};
</script>
