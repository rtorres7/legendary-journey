<template>
  <b-dropdown-item
    :to="link"
    :class="{
      'indent subregion': subregion,
      'region understated-title-text': !subregion,
    }"
    :data-usage="dataUsage"
  >
    {{ subregion ? subregionValue.name : display }}
  </b-dropdown-item>
</template>

<script>
import { kebabCase } from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "Region",
  props: {
    display: {},
    subregion: {
      default: false,
    },
  },

  computed: {
    ...mapGetters("metadata/criteria/subregions", ["getValueForCode"]),
    subregionValue() {
      if (this.subregion) {
        return this.getValueForCode(this.display);
      }
    },

    link() {
      if (this.subregion) {
        return "/subregions/" + this.subregionValue.name;
      }
      return "/regions/" + this.display;
    },
    dataUsage() {
      // returns something similar to nav-regions-subregion-africa-central
      let region_subregion = this.subregion ? "subregion" : "region";
      return kebabCase("nav-regions-" + region_subregion + this.display);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .region a {
  font-size: $font-size-6;
  color: $region-label;
}
.subregion {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

::v-deep .dropdown-item {
  font-size: $font-size-3;
}
</style>
