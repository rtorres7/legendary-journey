<template>
  <div class="mt-3 mb-7">
    <div class="d-flex">
      <h2 class="mb-2 dropdown-heading heading-stylized">
        {{ title }}
      </h2>
      <slot name="editButton"></slot>
    </div>
    <span v-if="description" class="d-block description pb-3">
      {{ description }}<span v-if="href">, </span>
      <router-link v-if="href" :to="href">
        read more
        <span v-if="readMoreSRText" class="sr-only">{{ readMoreSRText }}</span>
        <span v-else class="sr-only">{{ highlightsBanner }}</span>
        <span class="aria-hidden">></span>
      </router-link>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SectionHeader",
  props: ["title", "description", "href", "readMoreSRText"],
  computed: {
    ...mapState("metadata", ["highlightsBanner"]),
  },
};
</script>

<style scoped lang="scss">
.section-heading {
  .dropdown-heading {
    color: $pri-700 !important;
    font-size: $font-size-8;
  }
  .description {
    color: $alt-800;
    font-size: $font-size-3;
    font-weight: 400;
  }
}
</style>
