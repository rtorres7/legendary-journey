<template>
  <router-link :to="'/special_editions/' + link.id" class="w-fit">
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
      if (process.env.NODE_ENV === "offline") {
        return require("@/assets/ukraine_flag_70x70.png");
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
