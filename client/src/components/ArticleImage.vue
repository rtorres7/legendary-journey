<template>
  <div class="relative overflow-hidden">
    <template v-if="hasArticleImage(article)">
      <div
        class="h-full w-full absolute blur bg-center bg-no-repeat bg-cover"
        :style="{ background: 'url(' + getImgUrl(article) + ')' }"
      ></div>
      <img
        class="absolute h-full inset-x-0 mx-auto z-[5]"
        :src="getImgUrl(article)"
        alt=""
      />
    </template>
    <template v-else>
      <img
        class="max-h-full w-full m-auto object-contain bg-[#f1f1f1]"
        src="@/assets/image-not-available-wire-size.png"
        alt=""
      />
    </template>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const forcedBlurred = computed(() => store.state.testConsole.blurredImages);

    const hasArticleImage = (article) => {
      if (forcedBlurred.value) {
        return true;
      }
      return article.images?.length > 0;
    };

    const getImgUrl = (article) => {
      if (forcedBlurred.value) {
        return require("@/assets/ukraine.jpg");
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
    return {
      hasArticleImage,
      getImgUrl,
    };
  },
};
</script>
