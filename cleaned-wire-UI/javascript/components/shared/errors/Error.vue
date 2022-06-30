<template>
  <div class="overlay-background" :data-error-response="errorResponse">
    <b-card class="standard-page-margin mt-12" bg-variant="transparent">
      <h1>
        <div class="error-pretitle">Error {{ number }}</div>
      </h1>
      <div class="error-title mt-5">
        Oops! Something
        <br />
        went wrong.
      </div>
      <b-card-text class="error-body-text">
        <div class="error-subtitle mt-6">
          {{ subtitle }}
        </div>

        <div class="error-subtitle mt-5">
          The address typed may be incorrect.
        </div>
        <div class="error-subtitle-stylized">
          Check to make sure you have the correct spelling, capitalization,
          etc...
        </div>

        <div class="error-subtitle mt-5">
          Did you follow a link from somewhere else?
        </div>
        <div class="error-subtitle-stylized">
          If you reached this page from another part of the site, please
          <router-link class="contact-link" to="/feedback"
            >contact us</router-link
          >
          so we can correct the problem.
        </div>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: ["errorResponse", "number", "subtitle"],
};
</script>

<style scoped lang="scss">
.error-pretitle {
  font-size: $font-size-7;
  font-weight: light;
  color: $white;
  font-family: $font-family-heading;
  text-decoration: underline 5px solid $sec-600;
  text-underline-offset: 10px;
  margin-top: 4rem;
}
.error-title {
  font-size: $font-size-12;
  color: $white;
  font-family: $heading-stylized;
  line-height: 1.25em;
}
.error-subtitle {
  font-size: $font-size-3;
  color: $white;
  font-family: $font-family-heading;
}
.error-body-text {
  color: $white;
}
.error-subtitle-stylized {
  font-style: italic;
}
.overlay-background {
  // This might not be the correct location for this style in our codebase,
  // but maybe it can start here and maybe we'll pull the style out if we
  // think we'll use it more broadly.
  background-image: url("../../../assets/#{$overlay-image}");
  background-size: cover;
  background-position: center;
  background-color: $pri-800;
  min-height: 100vh;
}
.contact-link {
  color: $white !important;
  text-decoration: underline;
}
</style>
