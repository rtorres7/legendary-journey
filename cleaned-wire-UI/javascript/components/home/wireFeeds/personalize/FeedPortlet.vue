<template>
  <div>
    <b-form-group label="Feed Address">
      <b-form-input
        label="Enter feed address"
        ref="urlInput"
        v-model="form._temp_1"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Feed Title">
      <b-form-input label="Enter feed title" v-model="form.title" />
    </b-form-group>
  </div>
</template>

<script>
import Preview from "./Preview";
export default {
  name: "FeedPortlet",
  components: { Preview },
  props: ["form"],

  mounted() {
    this.$nextTick(
      function () {
        this.$refs.urlInput.$el.focus();
      }.bind(this)
    );
  },
};
</script>

<style scoped></style>
