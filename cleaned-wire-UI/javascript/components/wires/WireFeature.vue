<template>
  <b-row class="card-contents flex-grow-1" v-if="feature">
    <b-col>
      <WireDocument :document="document" :mainView="mainView" />
    </b-col>
    <b-col cols="3">
      <WireAdminToolBar :feature="feature" />
    </b-col>
  </b-row>
</template>

<script>
import WireAdminToolBar from "../wires/WireAdminToolBar";
import WireDocument from "../wires/WireDocument";

export default {
  name: "WireFeature",
  components: { WireAdminToolBar, WireDocument },
  data() {
    return {
      truncateLength: 225,
    };
  },
  props: {
    feature: {
      type: Object,
      required: true,
    },
    mainView: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    document() {
      return this.feature.document;
    },
  },
};
</script>

<style scoped lang="scss">
.sort-handle {
  padding: 0.5rem;
  cursor: move;
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}

.btn {
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}
</style>
