<template>
  <div v-if="project">
    <img
      :src="require(`../../assets/${project}-spinner.gif`)"
      :width="size"
      :height="size"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Spinner",
  computed: {
    ...mapState("metadata", ["project"]),
  },
  props: {
    size: {
      default: "100",
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
.spinner-border {
  height: $font-size-4;
  width: $font-size-4;
}
</style>
