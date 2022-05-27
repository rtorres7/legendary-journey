<template>
  <b-card :header="leader.short_classification">
    <router-link :to="leaderUrl">
      <b-row>
        <b-col class="col-4">
          <img :src="imageUrl" :alt="'image of ' + leader.name" />
        </b-col>
        <b-col>
          <b-card-title>{{ leader.name }}</b-card-title>
          <b-card-text>{{ truncatedPosition }}</b-card-text>
        </b-col>
      </b-row>
    </router-link>
  </b-card>
</template>

<script>
export default {
  name: "LeadershipCard",
  props: ["leader"],

  computed: {
    imageUrl() {
      return "/documents/" + this.leader.doc_num + "/images/carousel";
    },

    truncatedPosition() {
      return this.leader.position.slice(0, 100) + "...";
    },

    leaderUrl() {
      return "/documents/" + this.leader.doc_num;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/stylesheets/variables_and_mixins";

.text-muted {
  color: $alt-600;
  font-size: small;
}

img {
  border-radius: 50px;
  max-height: 75px;
}

.card .card-header {
  font-size: small;
  text-align: center;
}
</style>
