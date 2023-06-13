<template>
  <b-form-checkbox
    v-model="allSelected"
    :indeterminate="indeterminate"
    @change="toggleAll"
    autofocus
  >
    <div class="sr-only" v-if="allSelected">
      Press spacebar to de-select all documents. Individual document selection
      will be required upon form submission.
    </div>
    <div class="sr-only" v-else>
      Press spacebar to select first {{ numProducts() }} documents.
    </div>
    Select All
  </b-form-checkbox>
</template>

<script>
import SelectAllMixin from "./SelectAllMixin";
export default {
  name: "SelectAll",
  mixins: [SelectAllMixin],
};
</script>

<style scoped>
>>> label {
  justify-content: unset;
}
</style>
