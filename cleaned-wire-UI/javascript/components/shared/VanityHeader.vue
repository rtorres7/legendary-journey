<template>
  <div>
    <VanityTitle :title="title" :code="code ? code : title">
      <slot></slot>
    </VanityTitle>
    <Criteria />
  </div>
</template>

<script>
import VanityTitle from "../vanity/VanityTitle";
import Criteria from "../search/criteria/index";

export default {
  name: "VanityHeader",
  components: { Criteria, VanityTitle },

  props: ["title", "code"],
};
</script>

<style scoped lang="scss"></style>
