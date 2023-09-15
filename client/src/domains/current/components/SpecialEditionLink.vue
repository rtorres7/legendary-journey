<template>
  <router-link :to="'/feeds/' + link.id" class="w-fit">
    <div class="flex hover:underline">
      <img :src="getImgUrl(link)" class="mr-3 max-h-[70px]" />
      <div class="py-2">{{ link.name }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const getImgUrl = (link) => {
      if (import.meta.env.MODE === "offline") {
        return new URL(
          "@/shared/assets/ukraine_flag_70x70.png",
          import.meta.url
        ).href;
      }
      return link.image_path;
    };

    return {
      getImgUrl,
    };
  },
};
</script>
<style scoped lang="scss"></style>
