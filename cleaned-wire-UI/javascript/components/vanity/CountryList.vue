<template>
  <div class="d-flex flex-wrap justify-content-end">
    <b-button
      v-for="(country, ind) in countries"
      :key="ind"
      class="mr-2 mb-2 p-2"
      :to="'/countries/' + country.name"
      >{{ country.name }}</b-button
    >
  </div>
</template>

<script>
export default {
  name: "CountryList",
  props: ["countries"],
};
</script>

<style scoped></style>
