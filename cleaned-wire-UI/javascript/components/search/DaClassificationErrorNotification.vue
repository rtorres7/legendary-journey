<template>
  <div aria-live="polite">
    <b-col md="2" class="separator m-md-auto" />
    <b-row
      class="da-classif-error-notif pt-2 d-flex w-100"
      align="center"
      v-if="daClassifError && !loading"
    >
      <b-col>
        <div class="col-md-11">
          <span class="fa fa-bullhorn alt-700"></span> Search results that
          include {{ this.agency }} finished analysis products published prior
          to 2 August 2021 and carrying the 50X1-HUM or the 25X1-human
          declassification markers may contain an incorrect declassification
          date. This does not affect the substance of the product. Please refer
          to the
          <a
            href="https://blogs._temp_430.ic.gov/blogs/ciawire/?p=23015"
            _temp_576="_blank"
            >{{ this.name }} blog</a
          >
          for more information.
          <!-- on how to handle these documents. -->
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "DaClassificationErrorNotification",
  computed: {
    ...mapState("search", ["daClassifError", "loading"]),
    ...mapState("metadata", ["agency", "name"]),
  },
};
</script>

<style scoped lang="scss">
.da-classif-error-notif {
  color: $alt-900;
  font-size: $font-size-1;
}
.separator {
  border-bottom: 1px solid $alt-400;
}
</style>
