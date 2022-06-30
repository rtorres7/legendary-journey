<template>
  <div>
    <b-row class="align-items-center">
      <b-col
        :class="
          hero ? 'py-5 _temp_488-7 pr-6' : 'py-4 _temp_488-6 pr-4 justify-content-between'
        "
      >
        <b-card-title
          style="
             {
              height: 100%;
            }
          "
        >
          <Skeleton :height="hero ? '2.3rem' : '1rem'" class="my-2" />
          <Skeleton :height="hero ? '2.3rem' : '1rem'" class="my-2" />
          <Skeleton :height="hero ? '2.3rem' : '1rem'" class="my-2" />
          <Skeleton v-if="hero" :height="'2.3rem'" class="my-2" />
        </b-card-title>
        <b-card-text
          style="
             {
              height: 100%;
            }
          "
        >
          <Skeleton class="my-3" :minWidth="30" :maxWidth="45" />
        </b-card-text>
      </b-col>
      <b-col class="col-auto">
        <Skeleton
          :height="hero ? '275px' : '165px'"
          :width="hero ? '275px' : '165px'"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import WireImage from "@shared/WireImage";
import Skeleton from "@shared/Skeleton";
export default {
  name: "FakeCard",
  components: { Skeleton, WireImage },
  props: ["hero"],
};
</script>

<style scoped></style>
