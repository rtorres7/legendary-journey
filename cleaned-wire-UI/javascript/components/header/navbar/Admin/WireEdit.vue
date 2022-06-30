<template>
  <b-dropdown-item :href="'/wires/new?date=' + today"
    >Today's Book</b-dropdown-item
  >
</template>

<script>
export default {
  name: "WireEdit",
  computed: {
    today() {
      var today = new Date();
      today = today.toISOString().slice(0, 10);
      return today;
    },
    tomorrow() {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow = tomorrow.toISOString().slice(0, 10);
      return tomorrow;
    },
  },
};
</script>

<style scoped></style>
