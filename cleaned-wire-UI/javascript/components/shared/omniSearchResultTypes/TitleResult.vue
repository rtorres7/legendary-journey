<template>
  <div>
    <img :src="require('@assets/text.svg')" class="omni-search-icon" />
    <span v-html="htmlText" class="pl-4"></span><em> in Title Only</em>
  </div>
</template>
<script>
export default {
  name: "TitleResult",
  props: ["htmlText"],
};
</script>
