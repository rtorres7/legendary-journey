<template>
  <div>
    <img :src="require('@assets/text.svg')" class="omni-search-icon" />
    <span v-html="htmlText" class="pl-4"></span><em> in Identifier Only</em>
  </div>
</template>
<script>
export default {
  name: "IdentifierResult",
  props: ["htmlText"],
};
</script>
