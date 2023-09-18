<template>
  <div
    class="flex flex-col space-y-3 pb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <p class="font-semibold text-lg">Related Products</p>
    <template v-if="relatedProducts.length === 0">
      <div>There are no related products</div>
    </template>
    <template v-else>
      <ul class="space-y-1">
        <li v-for="relatedProduct in relatedProducts" :key="relatedProduct">
          <router-link
            class="flex hover:underline"
            :to="'/product/' + relatedProduct.document.doc_num"
            target="_blank"
          >
            <span class="block"
              >({{ relatedProduct.document.title_classification }})
              {{ relatedProduct.document.title }}</span
            >
          </router-link>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  props: {
    relatedProducts: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const docNum = computed(() => `${route.params.doc_num}`);
    const relatedProductLink = computed(
      () => `/documents/${docNum.value}/related_documents/`
    );

    return {
      docNum,
      relatedProductLink,
    };
  },
};
</script>

<style lang="scss"></style>
