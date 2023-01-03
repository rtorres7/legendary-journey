<template>
  <div id="img-container" class="relative overflow-hidden">
    <template v-if="hasArticleImage(article)">
      <div
        v-show="!smartRender"
        id="article-blur"
        class="h-full w-full absolute blur-lg bg-center bg-no-repeat bg-cover"
        :style="{ background: 'url(' + getImgUrl(article) + ')' }"
      ></div>
      <img
        id="article-img"
        :class="[
          smartRender ? '' : 'inset-x-0',
          'absolute h-full mx-auto z-[5]',
        ]"
        :src="getImgUrl(article)"
        alt=""
        @load="onImgLoad"
      />
    </template>
    <template v-else>
      <template v-if="!smartRender">
        <img
          class="max-h-full w-full m-auto object-contain bg-[#f1f1f1]"
          src="@/assets/image-not-available-wire-size.png"
          alt=""
        />
      </template>
    </template>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { isEmpty } from "@/helpers";

export default {
  props: {
    article: {
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

    const hasArticleImage = (article) => {
      if (sampleImage.value || uploadBinary.value) {
        return true;
      }
      let hasImages = true;
      if (isEmpty(article.images)) {
        hasImages = false;
      } else {
        if (article.images.table && isEmpty(article.images.table.article)) {
          hasImages = false;
        }
      }
      if (props.smartRender && !hasImages) {
        emit("imageNotFound");
      }
      return hasImages;
    };

    const getImgUrl = (article) => {
      if (sampleImage.value) {
        return require("@/assets/ukraine.jpg");
      }
      if (uploadBinary.value) {
        return uploadBinary.value;
      }
      let updatedAt;
      if (Array.isArray(article.images)) {
        updatedAt = article.images.filter(
          (image) => image.usage == "article"
        )[0].updated_at;
      } else if (article.images && article.images.table.article) {
        updatedAt = article.images.table.article.table.updated_at;
      } else {
        updatedAt = "";
      }
      return (
        window.location.origin +
        "/documents/" +
        article.doc_num +
        "/images/article?updated_at=" +
        updatedAt
      );
    };

    const onImgLoad = () => {
      if (props.smartRender) {
        const articleImgWidth =
          document.getElementById("article-img")?.clientWidth;
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
