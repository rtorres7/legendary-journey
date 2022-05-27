<template>
  <div class="d-block d-lg-none d-flex">
    <h3 class="sr-only">Quick Result Filters</h3>
    <b-button
      variant="link"
      class="p-0 ml-auto"
      aria-controls="aggregate-modal"
      :aria-expanded="modalShown ? 'true' : 'false'"
      @click="toggleModal"
      ref="showFilterButton"
      id="modal-toggle"
    >
      <span v-if="!modalShown">Show </span>
      <span v-else>Hide </span>
      Quick Filters
    </b-button>
    <b-modal
      id="aggregate-modal"
      ref="agg-modal"
      class="pt-4"
      title="Search Quick Filters"
    >
      <div class="d-block">
        <AggregationsRow />
      </div>
    </b-modal>
  </div>
</template>

<script>
import AggregationsRow from "./AggregationsRow";
export default {
  name: "AggregateCollapse",
  components: { AggregationsRow },
  data() {
    return {
      modalShown: false,
    };
  },

  methods: {
    toggleModal() {
      this.modalShown = !this.modalShown;
      this.$refs["agg-modal"].toggle("#modal-toggle");
    },
  },
};
</script>

<style scoped></style>
