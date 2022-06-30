<template>
  <b-col class="pt-6 _temp_488-6" cols="24" md="6">
    <b-row
      tabindex="0"
      @click="gotoLink(bluekeyFaqs)"
      class="mb-6 card-header more-info-card more-info-card-title"
    >
      <b-col class="mr-auto"><h3>FAQs</h3></b-col>
      <b-col cols="auto"
        ><img
          class="blog-icon _temp_488-4"
          alt="frequently asked questions"
          :src="require('@assets/faqs-icon-bk.svg')"
      /></b-col>
      <div class="contact-card-body">
        Answers to our most commonly asked questions.
      </div>
    </b-row>
  </b-col>
</template>

<script>
export default {
  name: "ContactUsResourcesCIAWire",
  components: {},
  data() {
    return {
      bluekeyFaqs:
        "https://intellipedia._temp_430.ic.gov/wiki/FBI_BlueKey_Frequently_Asked_Questions",
    };
  },
  methods: {
    gotoLink(link) {
      window.open(link, "_blank");
    },
  },
};
</script>
<style scoped lang="scss">
.blog-icon {
  height: 50px;
  width: 50px;
}
.contact-card-body {
  font-size: $font-size-2;
  font-style: italic;
  color: $pri-900;
  padding-top: 0.75rem;
}
.more-info-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid $pri-300;
  box-shadow: 0 3px 1px $pri-100;
  border-radius: unset;

  &:hover,
  &.focused {
    box-shadow: 0 5px 2px $pri-200;
  }
}
/* Title with blue background */
.more-info-card-title {
  color: $pri-600;
  &.h3 {
    font-size: $font-size-5;
    font-family: $heading-stylized;
  }
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: $pri-100;
  border: 1px solid $pri-300;
  border-radius: 0;
  cursor: pointer;
}
</style>
