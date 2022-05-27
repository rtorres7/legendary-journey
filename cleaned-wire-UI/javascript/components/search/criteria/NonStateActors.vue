<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import WireSelect from "./WireSelect";
export default {
  name: "NonStateActors",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Non State Actors",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/nonStateActors", {
      nonStateActors: "values",
    }),
    options() {
      let options = [];
      this.nonStateActors.forEach((nonStateActor) => {
        options.push({
          value: nonStateActor.code,
          text: nonStateActor.name,
          type: "non_state_actors[]",
        });
      });
      return options;
    },
  },
};
</script>

<style scoped></style>
