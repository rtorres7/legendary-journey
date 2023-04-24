<template>
  <div>
    <img :src="require('@assets/jump.svg')" class="omni-search-icon" />
    <span v-html="htmlText" class="pl-4"></span><em> Page</em>
  </div>
</template>
<script>
export default {
  name: "PageResult",
  props: ["htmlText"],
};
</script>
