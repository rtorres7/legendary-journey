<template>
  <div class="py-8 section-heading">
    <div class="standard-page-margin">
      <SectionHeader
        title="WIRe Sensitive Products"
        href="/search?sensitive=true&_temp_39=WIRE"
        description="Products Available in Sensitive Dissemination Services (SDS)"
        readMoreSRText="sensitive wire products"
        class="section-heading"
      />
      <Spinner v-if="featuresLoading" />
      <div v-else>
        <b-row v-if="fssDocs" class="custom-gutters mt-7">
          <template v-for="doc in fssDocs.slice(0, maxCards)">
            <b-col
              :key="doc.id"
              cols="24"
              md="12"
              lg="8"
              class="custom-gutter-col"
            >
              <FssCard :document="doc" />
            </b-col>
          </template>
          <b-col v-if="fssDocs.length === 0">
            <div class="no-results px-5">
              <span class="fa fa-warning"></span> Unable to retrieve WIRe
              Sensitive products from SDS.
            </div>
          </b-col>
          <HuiModal />
        </b-row>
        <div v-else class="no-results px-5">
          <span class="fa fa-warning"></span> No results available at this time
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FssCard from "./FssCard";
import HuiModal from "./HuiModal";
import SectionHeader from "../SectionHeader";
import Spinner from "@shared/Spinner";
import { mapGetters } from "vuex";

export default {
  name: "FssFeatured",
  components: { FssCard, HuiModal, SectionHeader, Spinner },
  data() {
    return {
      maxCards: 9,
    };
  },

  mounted() {
    this.retrieveFeaturedProducts();
  },

  computed: {
    ...mapGetters("features", ["featuresLoading", "fssDocs"]),
  },

  methods: {
    retrieveFeaturedProducts() {
      this.$store.dispatch("features/retrieveFeaturedFssProducts", {
        caller: this,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.section-heading {
  .dropdown-heading {
    color: $pri-700 !important;
    font-size: $font-size-8;
  }
  .description {
    color: $alt-800;
    font-size: $font-size-3;
    font-weight: 400;
  }
}

.no-results {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
