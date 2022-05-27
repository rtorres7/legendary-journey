<template>
  <div class="pills container-fluid pt-6 pb-4">
    <div class="align-items-center d-flex">
      <b-row class="standard-page-margin d-inline-flex align-self-stretch mb-4">
        <b-col class="mr-4 card-header card user-card-title">
          <h2 class="title-text">WIRe Customer Support</h2>
          WIRe Customer Support
          <div class="user-card-body">
            For questions or feedback on WIRe features or to request a site
            tutorial:
          </div>
          <div class="user-card-subtitle">
            <span class="fa fa-envelope-o pr-2" /><a
              :href="`mailto:${contactEmail}`"
              >{{ contactEmail }}</a
            >
          </div>
        </b-col>
        <b-col class="ml-4 mr-4 card-header card user-card-title">
          <h2 class="title-text">Access Support</h2>
          <div class="user-card-body">
            For immediate assistance regarding access to WIRe, contact Agency
            Operations Branch or fill out the form below:
          </div>
          <div class="user-card-subtitle">
            <span class="fa fa-phone pr-2" />SEC: 935-7155 DSN: 345-0504 COMM:
            571-204-4775 <span class="fa fa-envelope-o pr-2" /><a
              href="mailto:DPOSERVCNTR@_temp_28.IC.GOV"
              >DPOSERVCNTR@_temp_28.IC.GOV</a
            >
          </div>
        </b-col>
        <b-col class="ml-4 mr-4 card-header card user-card-title">
          <h2 class="title-text">_temp_28 Authors</h2>
          <div class="user-card-body">For help with WIRe articles:</div>
          <div class="user-card-subtitle">
            <span class="fa fa-envelope-o pr-2" /><a
              href="mailto:DA_APD_WIRE_Team"
              >DA_APD_WIRE_TEAM</a
            >
          </div>
          <div class="user-card-body">
            For questions about Executive Updates and noncurrent production:
          </div>
          <div class="user-card-subtitle">
            <span class="fa fa-envelope-o pr-2" /><a
              href="mailto:DA_APD_PDG_EDT_All"
              >DA_APD_PDG_EDT_All</a
            >
          </div>
        </b-col>
        <b-col class="ml-4 card-header card user-card-title">
          <h2 class="title-text">Production Feedback</h2>
          <div class="user-card-body">
            To provide feedback on a specific product or request a downgrade,
            contact the authoring office. Contact information can be found in
            the Document Details section of each document.
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ContactUsDetailsCiawire",
  computed: {
    ...mapState("metadata", ["contactEmail"]),
  },
};
</script>
<style scoped lang="scss">
.pills {
  background-color: $alt-200;
  top: 70px;
  border-bottom: solid 1px $alt-500;
  border-top: solid 1px $alt-500;
  z-index: 2;

  @media (max-width: $screen-sm) {
    top: 0px;
  }
}
.title-text {
  font-size: $font-size-5;
  font-family: $heading-stylized;
}
.user-card-title {
  color: $pri-600;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: white;
  border: 1px solid $alt-500;
  border-radius: 0;
}
.user-card-body {
  font-size: $font-size-2;
  font-family: "Roboto";
  font-style: italic;
  color: $pri-900;
  padding-top: 0.75rem;
}
.user-card-subtitle {
  font-size: $font-size-2;
  font-family: "Roboto Condensed";
  color: $pri-600;
  text-transform: uppercase;
  padding-top: 0.5rem;
}
</style>
