<template>
  <template v-if="accessProduct">
    <template v-if="manageProduct">
      <slot />
    </template>
  </template>
  <template v-else>
    <NotAuthorized :product="product" />
  </template>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { hasProductAccess } from "@/helpers";
import NotAuthorized from "@/components/NotAuthorized";

export default {
  components: {
    NotAuthorized,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const product = computed(() => store.state.product.document);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const organization = computed(() => store.getters["user/organization"]);

    const accessProduct = computed(() => {
      if (
        route.name === "product-preview" ||
        (route.name === "product" &&
          !hasProductAccess(product.value, organization.value))
      ) {
        return false;
      }
      return true;
    });

    const manageProduct = computed(() => {
      if (
        (route.name === "publish" ||
          route.name === "edit" ||
          route.name === "new") &&
        !canManageWire.value
      ) {
        return false;
      }
      return true;
    });

    return {
      product,
      accessProduct,
      manageProduct,
    };
  },
};
</script>
<style scoped lang="scss"></style>
