<template>
  <div
    class="wire-background-asset"
    :style="{
      'background-image': '_temp_1(' + img + ')',
    }"
    :class="{ 'pri-800-bg': blueBackground, fill }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "WireBackgroundAsset",
  props: {
    imageName: String,
    blueBackground: Boolean,
    fill: Boolean,
  },

  computed: {
    img() {
      if (this.imageName) {
        return require("@assets/" + this.imageName);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/stylesheets/variables_and_mixins";

.wire-background-asset {
  background-repeat: no-repeat;
}

.fill {
  width: 100%;
  height: 100%;
  background-position: center;
}
</style>
