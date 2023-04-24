<template>
  <b-modal
    @show="lockedAccessAttempt"
    v-model="showModal"
    title="Document Locked"
    title-class="modal-header-title"
    ok-only
  >
    <LockContent :document="document" />
  </b-modal>
</template>

<script>
import axios from "axios";
import LockContent from "../errors/LockContent";

export default {
  name: "LockedModal",
  components: { LockContent },
  props: ["document", "ind", "show"],

  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("hiding-modal");
        return;
      },
    },
  },
  methods: {
    lockedAccessAttempt() {
      // intentionally making a document access request and ignoring the response to generate an audit event
      axios
        .get("/documents/" + this.document.doc_num.replace("/", "!") + "/")
        .then(
          (response) => {},
          (error) => {}
        );
    },
  },
};
</script>

<style scoped lang="scss">
.locked {
  color: $alt-900;
  margin-left: -11px;
  margin-top: -11px;
  text-align: left;
}
.fa-lock span {
  color: $alt-900;
  font-family: $headings-font-family;
  text-transform: uppercase;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
