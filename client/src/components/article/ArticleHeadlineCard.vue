<template>
  <div
    class="
      h-96
      md:h-108
      lg:h-full
      w-full
      shadow-md
      bg-cover
      cursor-pointer
      hover:opacity-90 hover:underline
      rounded-b-lg
    "
    :style="{ background: `url(${selectedImage})`, backgroundSize: 'cover' }"
  >
    <router-link to="/article">
      <div
        class="
          p-3
          bg-white bg-opacity-90
          dark:bg-slate-800 dark:bg-opacity-90
          energy:bg-gray-800 energy:bg-opacity-90
          shadow-xl
        "
      >
        <h1
          class="
            text-black
            dark:text-teal-300
            energy:text-slate-200
            font-semibold
            text-lg
            mb-2
            lg:mb-4
          "
        >
          (U) This is the placeholder title for the headline article
        </h1>
        <p class="text-md mb-2 lg:mb-4">
          This is the brief description for the article. Sea et quas atqui
          disputationi, per populo expetenda eu, dolores vivendum vis at. In
          erat quaerendum vix, pro munere constituam.
        </p>
        <p
          class="
            text-sm text-slate-600
            dark:text-slate-300/80
            energy:text-slate-300/80
          "
        >
          5 May 2022
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ArticleHeadlineCard",
  data() {
    return {
      images: [
        require("@/assets/argentina.jpg"),
        require("@/assets/london.jpg"),
        require("@/assets/morocco.jpg"),
        require("@/assets/new-york.jpg"),
        require("@/assets/north-korea.jpg"),
        require("@/assets/ruins.jpg"),
        require("@/assets/ukraine.jpg"),
        require("@/assets/world-war-1.jpg"),
      ],
      selectedImage: "",
    };
  },
  created() {
    const idx = Math.floor(Math.random() * this.images.length);
    this.selectedImage = this.images[idx];
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
