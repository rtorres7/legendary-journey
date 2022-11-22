<template>
<div
    class="
      flex flex-col 
      space-y-3
      pb-4 
      border-t-2 
      md:border-t-0 
      border-b-2 border-slate-900/10 
      dark:border-slate-50/[0.06] 
      energy:border-zinc-700/25"
  >
    <p class="font-semibold mt-4 md:mt-0">Related Products</p>

  </div>
</template>

<script>

export default {
  props: {
    relatedProducts: {
      type: Array,
      required: true
    },
  },
  setup(props) {
    console.log("props.relatedProducts: ", props);

  },
};
</script>

<style lang="scss"></style>
