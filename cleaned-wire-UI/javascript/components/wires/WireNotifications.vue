<template>
  <div>
    <b-card class="w-100">
      <b-card-header>
        <h2>Notifications</h2>
        <p
          class="btn-group preview mb-0"
          v-if="canPreviewWireSubscriptionEmail"
        >
          <a
            :href="`/admin/feature_subscription_mailers?for_date=${selectedDate}`"
          >
            Preview
            <span class="sr-only">TOC Subscription</span> Email</a
          >
        </p>
      </b-card-header>
      <b-card-body>
        <b-table-simple>
          <tr v-if="wire.notification_scheduled_by">
            <label class="pr-2">Scheduled By:</label>
            {{
              wire.notification_scheduled_by
            }}
          </tr>
          <tr>
            <label class="pr-2">Scheduled At:</label>
            {{
              wire.notification_scheduled_at
            }}
          </tr>
          <tr>
            <label class="pr-2">Processed At:</label>
            {{
              wire.notification_processed_at
            }}
          </tr>
        </b-table-simple>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "WireNotifications",
  props: {
    wire: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("user", ["canPreviewWireSubscriptionEmail"]),
    selectedDate() {
      return this.$route.query.date || this.$route.params.date;
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
.preview {
  font-size: $font-size-2;
}
.card-body {
  padding-top: 0;
}
</style>
