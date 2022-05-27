<template>
  <b-dropdown-item
    :to="'/special_editions/' + concept.id"
    :data-usage="dataUsage"
  >
    <img class="mr-3" :src="concept.image_path" />{{ concept.name }}
  </b-dropdown-item>
</template>

<script>
import { kebabCase } from "lodash";

export default {
  name: "Concept",
  props: { concept: {} },
  computed: {
    dataUsage() {
      // returns something similar to nav-special-editions-u-fouo-nato-at-70
      return kebabCase("nav-special-editions" + this.concept.name);
    },
  },
};
</script>

<style scoped></style>
