<template>
  <b-card>
    <b-card-header class="mb-4"
      ><h2>Status:</h2>
      [{{ wire.state }}]</b-card-header
    >
    <div class="mt-4" v-if="wire.state !== 'posted'">
      <div class="form-group" v-if="publishedBeforeToday">
        <b-btn
          id="wire-state-btn"
          variant="primary"
          @click="updateWireState('publish')"
          >Ready to Publish</b-btn
        >
      </div>
      <div class="form-group" v-else>
        <b-btn
          id="wire-state-btn"
          variant="primary"
          @click="updateWireState(pendingWire ? 'ready' : 'hold')"
          >{{ buttonText }}</b-btn
        >
        <b-tooltip target="wire-state-btn" placement="right">
          {{ toolTipText }}</b-tooltip
        >
      </div>
    </div>
    <p class="mt-4 published" v-else>This WIRe has been published.</p>
  </b-card>
</template>

<script>
import axios from "axios";

export default {
  name: "WireStatus",
  props: {
    wire: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedPubDate() {
      return this.publicationDate.format("YYYY-MM-DD");
    },
    pendingWire() {
      return this.wire.state === "pending";
    },
    publicationDate() {
      return this.$moment(this.wire.publication_date);
    },
    publishedBeforeToday() {
      return this.publicationDate.isSameOrBefore(this.$moment());
    },
    buttonText() {
      return this.pendingWire
        ? `Stage For Publication On ${this.formattedPubDate}`
        : "Put Publication On Hold";
    },
    toolTipText() {
      return this.pendingWire
        ? `Allow this WIRe to publish automatically at midnight on ${this.formattedPubDate}`
        : "Prevent this WIRe from publishing until you are ready";
    },
  },
  methods: {
    updateWireState(newState) {
      axios
        .put(`/wires/${this.formattedPubDate}.json`, { state: newState })
        .then((response) => {
          if (response.status === 200) {
            this.$wireNotification({
              title: "Book Updated",
              duration: 5000,
              text: "This WIRe book has been updated.",
              type: "success",
            });
          }
          let updateWire = response.data.wire;
          if (updateWire.state === "posted") {
            this.$router.push({
              path: `/wires/${this.formattedPubDate}`,
            });
          } else {
            this.$emit("wireUpdated", updateWire);
          }
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error updating state",
            text: "Failed to update WIRe book state.",
          });
          // most likely session has timed out, reload to refresh tokens
          setTimeout(() => {
            document.location.reload();
          }, 1000);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.published {
  display: inline;
  padding: 0.25em 0;
  background: $pri-200;
  box-shadow: 0.5em 0 0 $pri-200, -0.5em 0 0 $pri-200;
}
.card-body {
  padding-top: 0;
}
</style>
