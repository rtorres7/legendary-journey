<template>
  <div id="pageFooter">
    <div id="bottomBanner" class="banner">
      <div class="standard-page-margin pt-5">
        <b-nav class="row pb-3">
          <b-col lg="5">
            <FisaSecurityReminder />
          </b-col>
          <b-col lg="14" class="d-flex flex-wrap justify-content-center">
            <b-nav-item to="/" data-usage="nav-front-page"
              >Front Page</b-nav-item
            >
            <b-nav-item
              to="/my_wire"
              v-if="featuresAvailable.ntk"
              data-usage="my-wire"
            >
              My {{ this.name }}</b-nav-item
            >
            <b-nav-item to="/contact_us">Contact Us</b-nav-item>
            <b-nav-item
              to="/revisions"
              v-if="featuresAvailable.revisions"
              data-usage="nav-revisions"
              >Revisions</b-nav-item
            >
            <ProgramOfAnalysis />
            <Resources />
          </b-col>
        </b-nav>
        <div class="d-flex justify-content-center my-5">
          <Logo />
        </div>
      </div>
      <ClassificationBar />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import ClassificationBar from "../header/ClassificationBar";
import ProgramOfAnalysis from "./ProgramOfAnalysis";
import Resources from "./Resources";
import FisaSecurityReminder from "./FisaSecurityReminder";
import Logo from "@shared/Logo";
export default {
  name: "Footer",
  components: {
    Logo,
    ClassificationBar,
    ProgramOfAnalysis,
    Resources,
    FisaSecurityReminder,
  },
  computed: {
    ...mapState("metadata", ["featuresAvailable", "name"]),
  },
};
</script>

<style scoped lang="scss">
#bottomBanner {
  background-color: $bg-x-dark;
  a:not(.btn),
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  label,
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6 {
    color: $text-light;
  }
}
/deep/ .nav-link {
  color: $text-light;
  .dropdown-toggle {
    padding: unset;
  }
}
</style>
