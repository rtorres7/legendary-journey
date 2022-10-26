<template>
  <div class="contact-details container-fluid pt-6 pb-4">
    <b-row class="standard-page-margin d-flex mb-4">
      <b-col class="mr-4 card-header card contact-card-title">
        <h2 class="title-text">BlueKey Support</h2>
        <div class="contact-card-body">
          For questions or feedback on BlueKey features or to request a site
          tutorial:
        </div>
        <div class="contact-card-subtitle">
          <span class="fa fa-envelope-o pr-2" /><a
            :href="`mailto:${contactEmail}`"
            >{{ contactEmail }}</a
          >
        </div>
      </b-col>
      <b-col class="ml-4 mr-4 card-header card contact-card-title">
        <h2 class="title-text">Product Support</h2>
        <div class="contact-card-body">For support regarding:</div>
        <ul>
          <li>
            <div class="contact-card-body">
              _temp_537 analytic products, to include locating _temp_38 contact
              information:
            </div>
            <div class="contact-card-subtitle">
              <span class="fa fa-envelope-o pr-2" /><a
                href="mailto:DI_DISSEMINATION_TEAM@_temp_537.IC_temp_54"
                >DI_DISSEMINATION_TEAM@_temp_537.IC_temp_54</a
              >
            </div>
          </li>
          <li>
            <div class="contact-card-body">
              _temp_537 IIR comments, evaluations, SDRs, and RFIs (to include IDENT
              requests):
            </div>

            <div class="contact-card-subtitle">
              <span class="fa fa-envelope-o pr-2" /><a
                href="mailto:_temp_537-DIV19-IIRS@_temp_537.IC_temp_54"
                >_temp_537-DIV19-IIRS@_temp_537.IC_temp_54</a
              >
            </div>
          </li>
          <li>
            <div class="contact-card-body">
              _temp_537 IIR requests for direct declassification:
            </div>
            <div class="contact-card-subtitle">
              <span class="fa fa-envelope-o pr-2" /><a
                href="mailto:SM_FBI_INTELBRANCH@_temp_537.IC_temp_54"
                >SM_FBI_INTELBRANCH@_temp_537.IC_temp_54</a
              >
            </div>
          </li>
          <li>
            <div class="contact-card-body">
              _temp_537 IIR requests concerning foreign disclosure and _temp_371 release:
            </div>
            <div class="contact-card-subtitle">
              <span class="fa fa-envelope-o pr-2" /><a
                href="mailto:_temp_537-FOREIGN-DISCLOSURE-IIRS@_temp_537.IC_temp_54"
                >_temp_537-FOREIGN-DISCLOSURE-IIRS@_temp_537.IC_temp_54</a
              >
            </div>
          </li>
        </ul>
        <div class="contact-card-body">
          Please include the serial number and subject line of the report in all
          correspondence, and advise if the request is time-sensitive and
          include a date or time frame required for a response.
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ContactUsDetailsBluekey",
  computed: {
    ...mapState("metadata", ["contactEmail"]),
  },
};
</script>
<style scoped lang="scss">
.contact-details {
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
.contact-card-title {
  color: $pri-600;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: white;
  border: 1px solid $alt-500;
  border-radius: 0;
}
.contact-card-body {
  font-size: $font-size-2;
  font-style: italic;
  color: $pri-900;
  padding-top: 0.75rem;
}
.contact-card-subtitle {
  font-size: $font-size-2;
  color: $pri-600;
  text-transform: uppercase;
  padding-top: 0.5rem;
}
</style>
