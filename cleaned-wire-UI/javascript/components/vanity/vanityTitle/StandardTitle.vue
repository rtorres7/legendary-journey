<template>
  <div>
    <h1 class="title heading-stylized">
      {{ title }}
    </h1>
  </div>
</template>

<script>
export default {
  name: "StandardTitle",
  props: ["title"],
};
</script>

<style scoped lang="scss">
.title {
  font-size: $font-size-10;
  margin-bottom: 0;
  color: $pri-900;
}
</style>
