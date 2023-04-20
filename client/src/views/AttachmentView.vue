<template>
  <img :src="getImgUrl($route.params.url)" alt="" />
</template>

<script>
export default {
  methods: {
    getImgUrl(url) {
      return require("@/assets/" + url);
    },
  },
};
</script>

<style>
</style>
