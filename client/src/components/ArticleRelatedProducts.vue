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
    <p class="font-semibold mt-4 md:mt-0">
      Related Products
    </p>
    <div v-if="relatedProducts.length === 0">
      There are no related products
    </div>
    <ul>
      <li v-for="relatedProduct in relatedProducts" :key="relatedProduct.document.id">
        <router-link
          :to="relatedProductLink + '/' + relatedProduct.id + '.json'" target="_blank"
        >
          {{ relatedProduct.document.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  props: {
    relatedProducts: {
      type: Array,
      required: true
    },
  },
  setup() {
    const route = useRoute();
    const docNum = computed(() => `${route.params.doc_num}`);
    const relatedProductLink = computed(() => `/documents/${docNum.value}/related_documents/`);
    
    return {
      docNum,
      relatedProductLink,
    }
  },
};
</script>

<style lang="scss"></style>
