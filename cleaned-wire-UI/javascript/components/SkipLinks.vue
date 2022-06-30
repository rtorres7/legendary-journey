<template>
  <div>
    <b-btn variant="link" @click="skipToMain" class="skip-link"
      >Skip to main content</b-btn
    >
    <b-btn variant="link" to="/accessibility" class="skip-link">
      Accessibility Help
    </b-btn>
  </div>
</template>

<script>
export default {
  name: "SkipLinks",
  props: ["targets"],
  methods: {
    skipToMain() {
      this.targets.skipLink.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.skip-link {
  &:link,
  &:visited {
    color: $bg-x-dark;
  }
  position: absolute;
  left: -9999px;
  top: 20px;
  z-index: 1000;
  &:active,
  &:focus {
    background: $bg-xx-light;
    left: 20px;
  }
}
</style>
