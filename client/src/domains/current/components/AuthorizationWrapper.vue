<template>
  <template v-if="authorized">
    <slot />
  </template>
  <template v-else>
    <NotAuthorized />
  </template>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import NotAuthorized from "@current/components/NotAuthorized.vue";

export default {
  components: {
    NotAuthorized,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const authorized = computed(() => {
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
      authorized,
    };
  },
};
</script>

<style scoped lang="scss"></style>
