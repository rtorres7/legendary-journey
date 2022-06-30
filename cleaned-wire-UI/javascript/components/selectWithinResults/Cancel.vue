<template>
  <b-button variant="link" @click="cancel">Cancel</b-button>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Cancel",
  methods: {
    cancel() {
      this.$bus.$emit("close-form");
    },
  },
};
</script>

<style scoped></style>
