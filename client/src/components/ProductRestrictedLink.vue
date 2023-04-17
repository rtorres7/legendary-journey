<template>
  <router-link
    v-if="!isProductLocked(product)"
    :to="{ name: 'product', params: { doc_num: product.doc_num } }"
  >
    <slot />
  </router-link>
  <a 
    v-else 
    tabindex="0" 
    class="hover:underline cursor-pointer" 
    @click="openDialog()"
  >
    <slot />
  </a>
  <MaxDialog class="max-w-[950px]" :isOpen="isDialogOpen" @close="closeDialog">
    <div class="flex flex-col space-y-6">
      <div>
        <p class="font-semibold mb-2">This product has restricted access</p>
        <p>
          The page you are attempting to access is restricted to users
          {{ userAccess() }}.
        </p>
      </div>
      <div class="flex flex-col space-y-6">
        <template
          v-for="paragraph in metadata.restricted_access"
          :key="paragraph"
        >
          <div>
            <p class="font-semibold mb-2">
              {{ paragraph.header }}
            </p>
            <p>{{ paragraph.content }}</p>
          </div>
        </template>
      </div>
    </div>
  </MaxDialog>
</template>
<script>
import { metadata } from "@/config";
import { ref } from "vue";
import { isProductLocked } from "@/helpers";

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const userAccess = () => {
      if (props.product?.org_restricted && props.product?.needed.orgs) {
        return props.product.needed.orgs.length > 1
          ? `affiliated with ${
              props.product.needed.orgs.slice(0, -1).join(", ") +
              " and " +
              props.product.needed.orgs.slice(-1)
            }`
          : `affiliated with ${props.product.needed.orgs}`;
      }
      return "who have the required accesses";
    };
    const isDialogOpen = ref(false);

    const closeDialog = () => {
      isDialogOpen.value = false;
    };

    const openDialog = () => {
      isDialogOpen.value = true;
    };

    return {
      metadata,
      userAccess,
      isProductLocked,
      isDialogOpen,
      closeDialog,
      openDialog,
    };
  },
};
</script>
