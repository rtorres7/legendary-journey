<template>
  <router-link
    v-if="!isProductLocked(product)"
    :to="{
      name: product.state === 'draft' ? 'product-preview' : 'product',
      params: { doc_num: product.doc_num },
    }"
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
  <MaxDialog class="max-w-[600px]" :isOpen="isDialogOpen" @close="closeDialog">
    <div class="flex flex-col space-y-6">
      <div>
        <p class="font-semibold mb-2">This product has restricted access</p>
        <p>
          The page you are attempting to access is restricted to users
          {{ userAccess() }}.
        </p>
      </div>
      <template v-if="nipfsNotEmpty()">
        <p>
          In order to view this document, you need to update your accesses by
          submitting an access request in JEMS for:
        </p>
        <template v-for="(values, item) in nipfsNeeded()" :key="item">
          <p class="capitalize">
            {{ item }}
          </p>
          <ul class="list-disc list-inside">
            <li v-for="value in values" :key="value">
              {{ value }}
            </li>
          </ul>
        </template>
      </template>
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
import { inject, ref } from "vue";
import { isProductLocked } from "@current/helpers";

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const metadata = inject("metadata");
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
    const nipfsNotEmpty = () => {
      const nipfs = nipfsNeeded();
      if (typeof nipfs != "undefined" && Object.keys(nipfs).length > 0) {
        return true;
      }
      return false;
    };
    const nipfsNeeded = () => {
      const nipfs = Object.fromEntries(
        Object.entries(props.product.needed).filter(
          ([key]) => !key.includes("orgs")
        )
      );
      return nipfs;
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
      nipfsNotEmpty,
      nipfsNeeded,
      isProductLocked,
      isDialogOpen,
      closeDialog,
      openDialog,
    };
  },
};
</script>
