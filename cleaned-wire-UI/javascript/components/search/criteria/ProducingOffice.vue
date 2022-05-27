<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import WireSelect from "./WireSelect";
import { mapState } from "vuex";
export default {
  name: "ProducingOffice",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Producing Offices",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/producingOffices", {
      producingOffices: "hierarchy",
    }),
    ...mapState("metadata/criteria", ["loading"]),
    options() {
      if (this.loading) {
        return [];
      }
      return this.producingOffices.flatMap((tierOneOffice) => {
        return [
          {
            text: tierOneOffice.parent,
            value: tierOneOffice.parent,
            children: true,
            header: true,
          },
          ...tierOneOffice.offices.map((tierTwoOffice) => {
            return {
              value: tierTwoOffice.code,
              text: tierTwoOffice.name,
              type: "producing_offices[]",
              indent: true,
            };
          }),
        ];
      });
    },
  },
  methods: {},
};
</script>

<style scoped></style>
