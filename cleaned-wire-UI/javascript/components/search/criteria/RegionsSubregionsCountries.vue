<template>
  <b-col v-bind="sizes">
    <label>
      <span class="d-block d-md-none d-xl-block nowrap-label">{{ label }}</span>
      <span class="d-none d-md-block d-xl-none">Geographic</span>
    </label>
    <WireSelect :options="options" :label="label" hideLabel />
  </b-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import WireSelect from "./WireSelect";

export default {
  name: "RegionsSubregionsCountries",
  components: { WireSelect },
  props: {
    hideForFSS: {
      default: false,
    },
    label: {
      type: String,
      default: "Regions, Subregions & Countries",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/regions", { regions: "values" }),
    ...mapState("metadata/criteria/countries", { countries: "values" }),
    ...mapGetters("metadata/criteria/subregions", {
      getSubregionForCode: "getValueForCode",
    }),

    options() {
      let options = [];

      if (!this.hideForFSS) {
        this.regions.forEach((region) => {
          options.push({
            value: region.code,
            text: region.name,
            type: "regions[]",
            children: true,
          });
          if (region.subregions.length > 1)
            region.subregions.forEach((subregionCode) => {
              const subregion = this.getSubregionForCode(subregionCode);
              options.push({
                value: subregion.code,
                text: subregion.name,
                type: "subregions[]",
                indent: true,
              });
            });
        });
      }

      options.push({
        text: "Unknown",
        value: "AX1",
        type: "countries[]",
        children: true,
      });
      options.push({
        text: "Countries",
        value: "",
        header: true,
      });

      this.countries.forEach((country) => {
        options.push({
          value: country.code,
          text: country.name,
          type: "countries[]",
          indent: true,
        });
      });

      return options;
    },
  },
};
</script>

<style scoped lang="scss">
.nowrap-label {
  white-space: nowrap;
}
</style>
