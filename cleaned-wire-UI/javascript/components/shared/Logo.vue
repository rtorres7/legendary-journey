<template>
  <div :class="{ inline: inline }">
    <img
      v-if="!loading"
      class="logo"
      :class="{ 'small-logo': small }"
      v-bind:alt="alt"
      :src="require(`@/assets/${logo_name}`)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Logo",
  props: {
    small: { type: Boolean },
    inline: { type: Boolean },
  },
  computed: {
    ...mapState("logo", ["logo_name", "alt", "loading"]),
  },
};
</script>

<style scoped lang="scss">
.logo {
  height: 100px;
  width: 100px;
}
.logo.small-logo {
  max-height: 40px;
  max-width: 50px;
}
.inline {
  display: inline;
}
</style>
