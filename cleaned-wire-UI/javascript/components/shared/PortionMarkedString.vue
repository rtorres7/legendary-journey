<template>
  <span>
    <span v-if="!containsHighlights" class="portion_marked_field"
      >({{ portionMark }})</span
    >
    <span v-html="textString" class="portion_marked_string"></span>
    <!-- <span class="sr-only">_temp_39 00012345</span> -->
  </span>
</template>

<script>
export default {
  name: "PortionMarkedString",
  props: ["portionMark", "textString"],
  computed: {
    containsHighlights() {
      return this.textString.includes("<em>");
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep em {
  background-color: $alt-400;
}
</style>
