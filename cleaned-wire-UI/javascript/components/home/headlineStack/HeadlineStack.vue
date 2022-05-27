<template>
  <div class="d-flex align-items-center my-2 border-bottom">
    <h2 class="mr-5 my-auto text-uppercase understated-title-text">
      {{ headlineTitle }}
    </h2>
    <span
      v-if="!secondaryLoading"
      class="row flex-grow-1 align-items-center d-flex justify-content-between executive-links-container"
    >
      <Card
        v-for="(headline, ind) in headlineStack"
        :key="ind"
        :headline="headline"
      />
    </span>
    <div class="ml-auto _temp_488-5">
      <router-link
        :to="{
          name: 'search',
          query: { 'selected_for[]': headlineTitle },
        }"
        class="all-executive-updates"
        data-usage="more-link"
      >
        View All
        <span class="sr-only"> {{ headlineTitle }} </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "./Card";

export default {
  name: "HeadlineStack",
  components: { Card },
  computed: {
    ...mapState("articles", [
      "secondaryLoading",
      "headlineStack",
      "headlineTitle",
    ]),
  },
};
</script>

<style scoped lang="scss">
@import "../../../../assets/stylesheets/variables_and_mixins";

.executive-links-container {
  border-right: 1px solid $border-light;
}

.all-executive-updates:visited {
  color: $link-color;
}

.understated-title-text {
  font-size: $font-size-2;
}
</style>
