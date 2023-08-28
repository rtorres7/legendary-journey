<template>
  <template v-if="hasProductImage(product)">
    <div
      id="image-blur"
      class="h-full w-full absolute blur-lg opacity-60 bg-center bg-no-repeat bg-cover"
      :style="{
        background:
          'url(' +
          getProductImageUrl(product.images, product.productNumber) +
          ')',
      }"
    ></div>
    <img
      id="product-img"
      class="inset-x-0 absolute h-full mx-auto z-[3]"
      :src="getProductImageUrl(product.images, product.productNumber)"
      alt=""
      @load="onImgLoad"
    />
  </template>
  <template v-else>
    <template v-if="!smartRender">
      <img
        class="max-h-full w-full m-auto object-contain bg-[#f1f1f1]"
        src="@/shared/assets/image-not-available-16x9.png"
        alt=""
      />
    </template>
  </template>
</template>
<script>
import { hasProductImage, getProductImageUrl } from "@/shared/helpers";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
    smartRender: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["imageLoaded", "imageNotFound"],
  setup(props, { emit }) {
    const onImgLoad = () => {
      if (props.smartRender) {
        const articleImgWidth =
          document.getElementById("product-img")?.clientWidth;
        emit("imageLoaded", articleImgWidth);
      }
    };

    return {
      onImgLoad,
      hasProductImage,
      getProductImageUrl,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
