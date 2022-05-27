<template>
  <b-row class="custom-gutters">
    <ContentItem
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      :section="section"
      :return-path="returnPath"
    />
  </b-row>
</template>

<script>
import ContentItem from "./ContentItem";

export default {
  name: "ContentItems",
  components: { ContentItem },
  props: ["items", "returnPath", "section"],
};
</script>

<style scoped></style>
