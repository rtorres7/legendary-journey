<template>
  <span :style="{ height, width: computedWidth }" class="skeleton-box"></span>
</template>

<script>
export default {
  name: "Skeleton",
  props: {
    maxWidth: {
      default: 100,
      type: Number,
    },
    minWidth: {
      default: 80,
      type: Number,
    },
    height: {
      default: "1em",
      type: String,
    },
    width: {
      default: null,
      type: String,
    },
  },

  computed: {
    computedWidth() {
      return (
        this.width ||
        `${Math.floor(
          Math.random() * (this.maxWidth - this.minWidth) + this.minWidth
        )}%`
      );
    },
  },
};
</script>

<style scoped lang="scss">
.skeleton-box {
  display: inline-block;
  vertical-align: middle;
  background-color: $alt-400;
}
</style>
