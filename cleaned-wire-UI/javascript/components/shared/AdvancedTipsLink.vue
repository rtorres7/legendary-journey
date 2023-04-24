<template>
  <div class="d-flex align-items-center">
    <router-link
      :to="{ name: 'advanced_tips' }"
      class="py-0 pr-0 advanced-tips"
    >
      <div class="d-flex align-items-center">
        <WireBackgroundAsset
          class="tips-icon ml-0"
          imageName="tips.svg"
          :class="{ 'd-none d-md-block': responsive }"
        />
        <span>Advanced Tips</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import WireBackgroundAsset from "./WireBackgroundAsset";

export default {
  name: "AdvancedTipsLink",
  props: {
    responsive: Boolean,
  },
  components: { WireBackgroundAsset },
};
</script>

<style scoped lang="scss">
.advanced-tips {
  position: absolute;

  &:visited {
    color: $link-color;
  }
}

.title-area .advanced-tips {
  right: 0;
  bottom: -10px;
}

.tips-icon {
  height: 20px;
  width: 20px;
}
</style>
