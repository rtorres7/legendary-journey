<template>
  <b-nav-item :id="id" :href="link" class="navBorder upcase">
    {{ display }}
  </b-nav-item>
</template>

<script>
export default {
  name: "NavLink",
  props: ["id", "link", "display"],
};
</script>

<style scoped></style>
