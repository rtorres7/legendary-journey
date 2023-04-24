<template>
  <b-row class="main-content">
    <b-col class="col-6" v-if="subregions">
      <SectionHeader title="Subregions" />
      <b-nav class="subregions-nav" vertical>
        <b-nav-item
          v-for="(subregion, ind) in region.subregions"
          :to="{
            name: 'subregions',
            params: { subregionName: subregion.name },
          }"
          :key="ind"
          >{{ subregion.name }}</b-nav-item
        >
      </b-nav>
    </b-col>
    <b-col class="px-5">
      <SectionHeader title="Countries" />
      <span class="sr-only">Please choose from the full country list.</span>
      <b-form-select
        :options="countryList"
        class="my-3"
        v-model="country"
      ></b-form-select>
      <RegionMap />
    </b-col>
  </b-row>
</template>

<script>
import CountryList from "./CountryList";
import RegionMap from "./RegionMap";
import SectionHeader from "../home/SectionHeader";

export default {
  name: "GlobeSelector",
  props: {
    region: {},
    countries: {},
    subregions: {
      default: true,
    },
  },
  components: { SectionHeader, CountryList, RegionMap },
  data() {
    return {
      country: null,
    };
  },

  computed: {
    countryList() {
      var countryList = { null: " " };
      this.countries.forEach((country) => {
        countryList[country.name] = country.name;
      });
      return countryList;
    },
  },

  watch: {
    country() {
      if (this.country) {
        this.$router.push({
          name: "countries",
          params: { countryName: this.country },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.main-content {
  height: 100%;
}

::v-deep .nav {
  .nav-link {
    border-left: 3px solid transparent;
    text-align: center;
    &:hover,
    &:focus {
      background-color: $alt-300;
    }
  }
}

.show-countries-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>
