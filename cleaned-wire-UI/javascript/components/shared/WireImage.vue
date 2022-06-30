<template>
  <div>
    <b-card-img-lazy
      :src="imgUrl"
      @error.native="loadError"
      v-show="!imageFailed"
      :blank-src="require('@assets/WIRe-BG-image-TOP.jpg')"
      class="rounded-0"
      :class="hero ? 'hero-image' : 'image'"
      role="presentation"
    ></b-card-img-lazy>
  </div>
</template>
<script>
export default {
  name: "wire-image",
  props: {
    hero: {
      default: false,
    },
    imgUrl: {},
  },

  data() {
    return {
      imageFailed: false,
    };
  },

  methods: {
    loadError() {
      this.imageFailed = true;
    },
  },
};
</script>

<style scoped>
.image {
  height: 165px;
  width: 165px;
}

.hero-image {
  height: 275px;
  width: 275px;
}
</style>
