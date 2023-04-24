<template>
  <div v-html="errorResponse"></div>
</template>

<script>
export default {
  name: "Forbidden",
  props: ["errorResponse"],
};
</script>

<style scoped></style>
