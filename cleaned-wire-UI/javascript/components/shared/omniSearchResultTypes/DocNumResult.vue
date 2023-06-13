<template>
  <div>
    <img :src="require('@assets/product.svg')" class="omni-search-icon" />
    <em class="pl-4">Jump to </em><span v-html="htmlText"></span>
  </div>
</template>
<script>
export default {
  name: "DocNumResult",
  props: ["htmlText"],
};
</script>
