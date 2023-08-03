<template>
  <template v-if="hasArticleImage(product)">
    <div
      id="image-blur"
      class="h-full w-full absolute blur-lg opacity-60 bg-center bg-no-repeat bg-cover"
      :style="{ background: 'url(' + getImgUrl(product) + ')' }"
    ></div>
    <img
      id="product-img"
      class="inset-x-0 absolute h-full mx-auto z-[3]"
      :src="getImgUrl(product)"
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
import { computed } from "vue";
import { useStore } from "vuex";
import { isEmpty } from "@current/helpers";
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
    const store = useStore();
    const sampleImage = computed(() => store.state.testConsole.sampleImage);
    const uploadBinary = computed(() => store.state.testConsole.uploadBinary);
    const hasArticleImage = (product) => {
      if (sampleImage.value || uploadBinary.value) {
        return true;
      }
      let hasImages = true;
      if (isEmpty(product.images)) {
        hasImages = false;
      } else {
        if (product.images.table && isEmpty(product.images.table.article)) {
          hasImages = false;
        }
      }
      if (props.smartRender && !hasImages) {
        emit("imageNotFound");
      }
      return hasImages;
    };
    const getImgUrl = (product) => {
      if (sampleImage.value) {
        return new URL("@/shared/assets/sydney.jpg", import.meta.url).href;
      }
      if (uploadBinary.value) {
        return uploadBinary.value;
      }
      let updatedAt;
      if (Array.isArray(product.images)) {
        updatedAt = product.images.filter(
          (image) => image.usage == "article"
        )[0].updated_at;
      } else if (product.images && product.images.table.article) {
        updatedAt = product.images.table.article.table.updated_at;
      } else {
        updatedAt = "";
      }
      return (
        window.location.origin +
        "/documents/" +
        product.doc_num +
        "/images/article?updated_at=" +
        updatedAt
      );
    };
    const onImgLoad = () => {
      if (props.smartRender) {
        const articleImgWidth =
          document.getElementById("product-img")?.clientWidth;
        emit("imageLoaded", articleImgWidth);
      }
    };
    return {
      hasArticleImage,
      onImgLoad,
      getImgUrl,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
