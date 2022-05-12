<template>
  <BaseCard class="flex flex-col lg:flex-row md:max-w-xl hover:underline">
    <router-link to="/article">
      <div class="p-6 flex flex-col justify-start">
        <h1
          class="
            text-black
            dark:text-teal-300
            energy:text-slate-200
            text-md
            mb-2
            lg:mb-4
          "
        >
          (U) This is the placeholder headline for an older article
        </h1>

        <p class="text-sm mb-2 lg:mb-4">
          <img
            class="lg:hidden float-right w-auto h-28 rounded-lg px-1"
            :src="selectedImage"
            alt=""
          />
          Ut est iusto decore nonumy, cum no mollis saperet. Esse percipitur id
          sea, mea no dicam aperiri. Ex assum quando aliquip his, vero porro
          voluptaria cum ea. Vero labore scribentur.
        </p>
        <p
          class="
            text-slate-600
            dark:text-slate-300/80
            energy:text-slate-300/80
            text-sm
          "
        >
          31 March 2022
        </p>
      </div>
    </router-link>
    <img
      class="
        hidden
        lg:block
        w-full
        h-96
        md:h-auto
        object-cover
        lg:w-48
        rounded-t-lg
        lg:rounded-none lg:rounded-r-lg
      "
      :src="selectedImage"
      alt=""
    />
  </BaseCard>
</template>

<script>
import BaseCard from "@/layout/BaseCard.vue";
export default {
  components: {
    BaseCard,
  },
  data() {
    return {
      images: [
        require("@/assets/farmers.jpg"),
        require("@/assets/havana.jpg"),
        require("@/assets/more-farmers.png"),
        require("@/assets/papaya-dog.png"),
        require("@/assets/people.png"),
        require("@/assets/traffic.jpg"),
        require("@/assets/train.png"),
        require("@/assets/user.png"),
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