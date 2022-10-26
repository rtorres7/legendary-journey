<template>
  <b-col v-bind="sizes" class="mt-3">
    <b-row>
      <b-col xs="8" sm="24" md="8" lg="24" xl="18" class="px-0"
        ><FisaRole label="_temp_214 Role" class="pl-0"
      /></b-col>
      <b-col xs="8" sm="10" md="8" lg="12" xl="10" class="px-0"
        ><ProgramOfAnalysis label="_temp_384" class="pl-0"
      /></b-col>
      <b-col xs="8" sm="14" md="8" lg="12" xl="14" class="px-0"
        ><UsPerson label="USPER" class="pl-0"
      /></b-col>
    </b-row>
  </b-col>
</template>

<script>
import FisaRole from "./FisaRole";
import ProgramOfAnalysis from "./ProgramOfAnalysis";
import UsPerson from "./UsPerson";

export default {
  name: "FisaPoaAndUsPerson",
  components: { FisaRole, ProgramOfAnalysis, UsPerson },
  props: {
    sizes: {
      type: Object,
      required: false,
    },
  },
};
</script>

<style scoped lang="scss">
.nowrap-label {
  white-space: nowrap;
}

::v-deep .form-group {
  margin-bottom: 0.5rem;
}
</style>
