<template>
  <b-col class="pt-6 pl-6" cols="24" md="6">
    <b-row
      @click="gotoLink(wireFaqs)"
      tabindex="0"
      class="mb-6 card-header more-info-card more-info-card-title"
    >
      <b-col class="mr-auto"><h3>FAQs</h3></b-col>
      <b-col cols="auto"
        ><img
          class="blog-icon pl-4"
          alt="frequently asked questions"
          :src="require('@assets/faqs-icon.svg')"
      /></b-col>
      <div class="user-card-body">
        Answers to our most commonly asked questions.
      </div>
    </b-row>
    <b-row
      tabindex="0"
      @click="gotoLink(wireBlog)"
      class="mb-6 card-header more-info-card more-info-card-title"
    >
      <b-col class="mr-auto"><h3>WIRe Blog</h3></b-col>
      <b-col cols="auto"
        ><img
          class="blog-icon pl-4"
          alt="wire blog"
          :src="require('@assets/blog-icon.svg')"
      /></b-col>
      <div class="user-card-body">
        For additional help topics, visit our blog.
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
      wireBlog: "_temp_525blogs.intelink._temp_0/blogs/_temp_540",
      wireFaqs:
        "_temp_525intellipedia.intelink._temp_0/wiki/CIA_WIRe_Frequently_Asked_Questions",
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
.form-title {
  color: $pri-600;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
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
.user-card-title {
  color: $pri-600;
  font-size: $font-size-5;
  font-family: $heading-stylized;
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
.label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
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
