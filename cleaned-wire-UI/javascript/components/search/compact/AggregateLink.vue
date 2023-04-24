<template>
  <div class="">
    <b-btn
      @click="addToQueryParams(aggregateType + '[]', aggregate.key)"
      :aria-label="'Apply ' + name + ' filter'"
      class="aggregate-link p-0"
      variant="link"
    >
      {{ name }} <span class="count">({{ count }})</span>
    </b-btn>
  </div>
</template>

<script>
import urlStore from "@shared/mixins/urlStore";

export default {
  name: "AggregateLink",
  props: ["aggregate", "aggregateType"],
  mixins: [urlStore],
  computed: {
    name() {
      return this.aggregate.name;
    },

    count() {
      return this.aggregate.count;
    },
  },
};
</script>

<style scoped lang="scss">
.aggregate-link {
  text-align: left;
}

.count {
  color: $text-dark;
}
</style>
