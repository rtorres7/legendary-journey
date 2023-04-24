<template>
  <b-col class="col-md-12 col-lg-8">
    <b-card class="search">
      <b-row>
        <b-col class="col-15">
          <b-card-title title-tag="h3">
            {{ article.title }}
          </b-card-title>
        </b-col>
      </b-row>
    </b-card>
  </b-col>
</template>

<script>
export default {
  name: "Card",
  props: ["article"],
};
</script>

<style scoped></style>
