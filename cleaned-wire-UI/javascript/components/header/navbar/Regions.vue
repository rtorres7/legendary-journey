<template>
  <b-nav-item-dropdown ref="dropdown" id="nav_regions" text="Regions">
    <div class="d-flex flex-md-row">
      <div class="d-flex justify-content-around flex-wrap">
        <div class="d-flex flex-column flex-sm-row">
          <div>
            <div
              v-for="(region, ind) in regionsFirstHalf"
              :key="ind"
              class="region-group"
            >
              <Region :display="region.name" />
              <Region
                v-for="(subregion, ind) in region.subregions"
                :key="ind"
                :display="subregion"
                :subregion="true"
              />
            </div>
          </div>
          <div>
            <div
              v-for="(region, ind) in regionsSecondHalf"
              :key="ind"
              class="region-group"
            >
              <Region :display="region.name" />
              <Region
                v-for="(subregion, ind) in region.subregions"
                :key="ind"
                :display="subregion"
                :subregion="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="region-map-container map-subtext px-6 mb-5 d-none d-md-block">
        <div>Select your country from the map or the dropdown</div>
        <div id="countries-dropdown-sr" class="sr-only">
          For a more pleasant keyboard experience press alt + s to to jump to
          our omni-search to quickly find your countries landing page.
        </div>
        <b-form-select
          v-if="!loading"
          @change="goToCountry"
          :options="countryList"
          class="country-select"
          v-model="country"
          aria-label="Country selection"
          aria-describedby="countries-dropdown-sr"
        ></b-form-select>
        <RegionMap
          @countrySelected="closeDropdown"
          :inNav="true"
          class="mt-3"
        />
        <div
          class="mt-3 map-subtext"
          v-if="featuresAvailable.showExpandedCountryLink"
        >
          View a
          <a
            class="faq-link"
            _temp_576="blank"
            href="https://blogs._temp_430.ic.gov/blogs/ciawire/files/2021/10/2020-08793-_temp_28-DA-vis-01_noSourced.pdf"
            >list of countries</a
          >
          that fall under each region and subregion
        </div>
      </div>
    </div>
    <div class="region-map-container px-6 mb-5 d-block d-md-none">
      <div>Select your country from the dropdown</div>
      <b-form-select
        v-if="!loading"
        @change="goToCountry"
        :options="countryList"
        v-model="country"
        aria-label="Country selection"
      ></b-form-select>
    </div>
  </b-nav-item-dropdown>
</template>

<script>
import Region from "./Region";
import { mapState, mapGetters } from "vuex";
import HotkeyText from "../../shared/HotkeyText";
var RegionMap = () =>
  import(/* webpackChunkName: 'map' */ "../../vanity/RegionMap");

// TODO this is not perfect, we need to adjust the row/column/d-flex layout of the regions dropdown to fit all screen sizes better
export default {
  name: "Regions",
  components: { HotkeyText, RegionMap, Region },

  data() {
    return {
      country: null,
    };
  },

  computed: {
    ...mapState("metadata/criteria/regions", { regions: "values" }),
    ...mapState("metadata/criteria", ["loading"]),
    ...mapState("metadata", ["featuresAvailable"]),
    ...mapState("metadata/criteria/countries", { countries: "values" }),
    ...mapGetters("metadata/criteria/regions", ["getSubregions"]),
    countryList() {
      var countryList = [];
      if (!this.loading) {
        countryList = Array.from(this.countries, (x) => {
          return x.name;
        });
      }
      return countryList;
    },

    regionsFirstHalf() {
      if (this.loading) {
        return [];
      }
      return this.regions.slice(0, 3);
    },
    regionsSecondHalf() {
      if (this.loading) {
        return [];
      }
      return this.regions.slice(3, this.regions.length);
    },
  },

  methods: {
    closeDropdown() {
      this.$refs.dropdown.hide(true);
    },

    goToCountry() {
      this.$router.push({
        name: "countries",
        params: {
          countryName: this.country,
        },
      });
      this.country = null;
      this.closeDropdown();
    },
  },
};
</script>

<style scoped lang="scss">
.faq-link {
  color: $faq-link;
}

#nav_regions {
  position: static;
}

/deep/ .dropdown-menu {
  width: 100%;
  padding: 2rem 3rem;
}

.region-map-container {
  width: 60%;
  position: relative;
}

.reveal {
  position: absolute;
  left: -99999px;
  background-color: $white;
  &:active,
  &:focus {
    left: 10px;
  }
}
.region-group {
  padding-bottom: 0.75rem;
}
.country-select {
  max-width: 500px;
}
</style>
