<template>
  <b-btn @click="$emit('input', !value)" :variant="variant">
    {{ value ? hideText : showText }}
    <slot />
  </b-btn>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    showText: {
      type: String,
      default: "Show",
    },
    hideText: {
      type: String,
      default: "Hide",
    },
    variant: {
      type: String,
      default: "link",
    },
  },
};
</script>

<style scoped lang="scss"></style>
