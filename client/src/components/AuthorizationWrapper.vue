<template>
  <template v-if="authorized">
    <slot />
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

    const authorized = computed(() => {
      if (!hasProductAccess(product.value, organization.value)) {
        return false;
      }
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
      authorized,
    };
  },
};
</script>
<style scoped lang="scss"></style>
