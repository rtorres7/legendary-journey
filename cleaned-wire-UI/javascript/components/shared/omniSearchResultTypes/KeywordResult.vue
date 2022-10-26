<template>
  <div>
    <img :src="require('@assets/text.svg')" class="omni-search-icon" />
    <span v-html="htmlText" class="pl-4"></span><em> Keyword Search</em>
  </div>
</template>
<script>
export default {
  name: "KeywordResult",
  props: ["htmlText"],
};
</script>
