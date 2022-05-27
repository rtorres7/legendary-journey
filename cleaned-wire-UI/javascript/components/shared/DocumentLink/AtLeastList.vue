<template>
  <li v-if="values">
    At least one of the following NIPF {{ nipf_section }}:
    <ul>
      <li v-for="(value, ind) in values">
        {{ value }}
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: "AtLeastList",
  props: ["needed", "section"],

  computed: {
    values() {
      return this.needed[this.section];
    },
    nipf_section() {
      if (this.section === "issues") {
        return "topics";
      }
      if (this.section === "subregions") {
        return "regions";
      }
      return this.section;
    },
  },
};
</script>

<style scoped></style>
