<template>
  <div id="img-container" class="relative overflow-hidden">
    <template v-if="hasArticleImage(article)">
      <div
        class="h-full w-full absolute blur bg-center bg-no-repeat bg-cover"
        :style="{ background: 'url(' + getImgUrl(article) + ')' }"
      ></div>
      <img
        id="article-img"
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
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

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
  setup(props) {
    const store = useStore();

    const sampleImage = computed(() => store.state.testConsole.sampleImage);
    const uploadBinary = computed(() => store.state.testConsole.uploadBinary);

    const hasArticleImage = (article) => {
      if (sampleImage.value || uploadBinary.value) {
        return true;
      }
      return article.images?.length > 0;
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

    onMounted(() => {
      if (props.smartRender && hasArticleImage(props.article)) {
        const imageContainerWidth =
          document.getElementById("img-container").clientWidth;
        const renderedImageWidth =
          document.getElementById("article-img").clientWidth;
        if (imageContainerWidth > renderedImageWidth) {
          document
            .getElementById("img-container")
            .setAttribute("style", `width:${renderedImageWidth}px`);
        }
      }
    });

    return {
      hasArticleImage,
      getImgUrl,
    };
  },
};
</script>
