<template>
  <div id="pageHeader">
    <div id="topBanner" class="banner">
      <SecurityBanner />
      <ClassificationBar />
      <div v-if="$route.name === 'home'" class="standard-page-margin pt-5 pb-2">
        <h1>
          <div
            class="d-flex align-items-end mb-2 header-overlay-start header-overlay-end"
          >
            <div class="heading-image">
              <Logo />
            </div>
            <div v-if="agency" class="heading-text ml-2">
              <span class="org-text">{{ this.agency }}</span> {{ this.name }}
            </div>
          </div>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ClassificationBar from "./ClassificationBar";
import SecurityBanner from "./SecurityBanner";
import Logo from "@shared/Logo";

export default {
  name: "Header",

  components: {
    ClassificationBar,
    SecurityBanner,
    Logo,
  },
  computed: {
    ...mapState("metadata", ["agency", "name"]),
  },
};
</script>

<style scoped lang="scss">
.banner {
  background-color: $bg-x-dark;
}

.header-overlay-end {
  position: relative;

  &::before {
    content: "";
    background-image: url("../../assets/#{$overlay-image}");
    background-size: 300px 300px;
    display: block;
    height: 250px;
    width: 300px;
    position: absolute;
    top: -100px;
    right: 50px;
    opacity: 80%;
  }
}

h1 {
  margin: 0;

  .logo {
    max-height: 100px;
    max-width: 100px;
  }
}

.header-overlay-start {
  position: relative;

  &::after {
    content: "";
    background-image: url("../../assets/#{$overlay-image}");
    background-size: 300px 300px;
    display: block;
    height: 250px;
    width: 300px;
    position: absolute;
    top: -100px;
    left: -190px;
  }
}
</style>
