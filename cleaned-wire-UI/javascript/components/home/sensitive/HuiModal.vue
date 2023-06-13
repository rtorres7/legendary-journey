<template>
  <b-modal
    title="Launching HUI"
    title-class="modal-header-title"
    ok-title="Acknowledge"
    @ok="updateHuiCookie"
    v-model="showHuiAcknowledgement"
    ok-only
  >
    <b-card>
      WIRe Sensitive Products open in the HUI client. If it is not installed, it
      can be found in the Software Center.
    </b-card>
  </b-modal>
</template>

<script>
export default {
  name: "HuiModal",
  data() {
    return {
      cookieName: "hui-acknowledgement",
      showHuiAcknowledgement: false,
    };
  },
  mounted() {
    this.$bus.$on("sdsLinkClicked", () => {
      this.showHuiAcknowledgement =
        this.$cookies.get(this.cookieName) !== "true";
    });
  },
  methods: {
    updateHuiCookie() {
      this.$cookies.set(this.cookieName, true, { expires: 1 });
      this.showHuiAcknowledgement = false;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
