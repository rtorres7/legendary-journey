<template>
  <img :src="getImgUrl($route.params.url)" alt="" />
</template>

<script>
export default {
  methods: {
    getImgUrl(url) {
      return new URL("@/shared/assets/" + url, import.meta.url).href;
    },
  },
};
</script>

<style></style>
