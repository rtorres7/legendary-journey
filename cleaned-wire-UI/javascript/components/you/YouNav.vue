<template>
  <b-dd-item :to="{ name: routeName, params: { id: user_id } }">{{
    display
  }}</b-dd-item>
</template>

<script>
export default {
  props: ["routeName", "display", "user_id"],
  computed: {
    active() {
      return this.$route.name === this.routeName;
    },
  },
};
</script>

<style scoped lang="scss"></style>
