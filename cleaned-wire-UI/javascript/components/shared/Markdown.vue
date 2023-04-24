<template>
  <vue-markdown :source="markdownText"></vue-markdown>
</template>

<script>
export default {
  name: "Markdown",
  props: ["markdownText"],
};
</script>

<style scoped>
>>> h2 {
  font-size: 1.4rem;
}
>>> .task-list-item {
  list-style: none;
}
</style>
