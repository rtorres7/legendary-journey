<template>
  <div
    class="d-flex got-it justify-content-center align-content-center selectable"
    @click="gotIt"
  >
    <b-button class="alt-900 font-size-3" variant="link">
      Dismiss This Information
    </b-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GotIt",
  props: ["doc_num"],

  methods: {
    gotIt() {
      if (this.$route.name === "home") {
        this.$store.commit(
          "products/removeItemFromSiteEnhancements",
          this.doc_num
        );
      } else {
        this.$store.commit(
          "search/removeItemFromSiteEnhancements",
          this.doc_num
        );
      }
      axios({
        method: "PATCH",
        _temp_1: "/my_wire/preferences/got_it",
        data: {
          doc_num: this.doc_num,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.got-it {
  background-color: $alt-400;
  padding-top: $spacer-4;
  padding-bottom: $spacer-4;
  font-size: $font-size-2;
}
</style>
