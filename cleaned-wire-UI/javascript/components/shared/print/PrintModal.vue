<template>
  <b-modal
    id="social-print-edition"
    ref="social-print-modal"
    title="WIRe - Print Edition"
    hide-footer
    size="lg"
    title-class="modal-header-title"
  >
    <div id="print-modal-text" v-html="text"></div>
  </b-modal>
</template>

<script>
import printMixin from "./printMixin";

export default {
  name: "PrintModal",
  mixins: [printMixin],

  methods: {
    closeModal() {
      this.$refs["social-print-modal"].hide();
    },
  },

  mounted() {
    this.$bus.$on("social-print-done", this.closeModal);
  },
};
</script>

<style scoped lang="scss">
/deep/ .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
