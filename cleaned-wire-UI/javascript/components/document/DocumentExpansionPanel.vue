<template>
  <div>
    <div class="blue-600 separator pt-3 d-flex" v-b-toggle="panelId">
      <span class="panel-header"
        ><h3><slot name="header"></slot></h3
      ></span>
      <WireBackgroundAsset
        image-name="less-more.svg"
        class="less-more-image ml-auto"
        fill
        :class="{ rotate: expanded }"
        aria-hidden="true"
      />
    </div>
    <b-collapse
      :id="panelId"
      :aria-hidden="!expanded"
      v-model="expanded"
      :ref="panelId"
    >
      <b-card class="alt-800 doc-details">
        <slot name="content"></slot>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import WireBackgroundAsset from "../shared/WireBackgroundAsset";

export default {
  name: "DocumentExpansionPanel",
  components: { WireBackgroundAsset },
  data() {
    return {
      expanded: false,
    };
  },
  props: {
    panelId: {
      type: String,
      required: true,
    },
    // _temp_506 string used to determine if panel should be collapsed or expanded
    expandPrefix: {
      type: String,
      required: false,
    },
  },
  mounted() {
    this.updatePanelState();
  },
  watch: {
    $route() {
      this.updatePanelState();
    },
  },
  methods: {
    updatePanelState() {
      if (
        this.expandPrefix &&
        this.$route.hash &&
        this.$route.hash.includes(this.expandPrefix)
      ) {
        this.expanded = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
}
.doc-details {
  font-size: $font-size-2;
}
.less-more-image {
  height: 16px;
  width: 16px;
  transform: rotate(270deg);
}
.rotate {
  transform: rotate(360deg);
}
.panel-header h3 {
  text-transform: uppercase;
  font-size: $font-size-4;
}
</style>
