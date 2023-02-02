<template>
  <router-link
    v-if="!isProductLocked(product)"
    :to="{ name: 'product', params: { doc_num: product.doc_num } }"
  >
    <slot />
  </router-link>
  <a v-else>
    <slot />
  </a>
</template>
<script>
import { isProductLocked } from "@/helpers";

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return {
      isProductLocked,
    };
  },
};
</script>
