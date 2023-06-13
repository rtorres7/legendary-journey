<template>
  <b-col md="12" class="recent p-3 my-2 row">
    <b-col cols="6">
      <img :src="imgUrl" class="image" alt="" />
    </b-col>
    <b-col cols="18 d-flex flex-wrap">
      <router-link :to="'/documents/' + product.doc_num">
        <span class="portion_marked_field"
          >({{ product.title_classification }})</span
        >
        <span>{{ product.title }}</span>
      </router-link>
      <div class="mt-3 w-100 align-self-end d-flex">
        <span class="ml-auto text-muted">{{
          (product.publication_date
            ? product.publication_date
            : product.posted_at) | moment("dddd, MMMM Do YYYY")
        }}</span>
      </div>
    </b-col>
  </b-col>
</template>

<script>
import WireImage from "@shared/WireImage";
export default {
  name: "WireFeaturedCard",
  components: { WireImage },
  props: ["product"],

  computed: {
    imgUrl() {
      return "/documents/" + this.product.doc_num + "/images/product";
    },
  },
};
</script>

<style scoped lang="scss">
.recent {
  border-radius: unset;
  background-color: $alt-300;
}

.image {
  height: 75px;
  width: 75px;
}

.date {
}
</style>
