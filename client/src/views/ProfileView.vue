<template>
  <!-- TODO: This is a work in progress -->
  <div class="text-lg py-4 font-semibold">Profile page</div>
  {{ user }}
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const user = computed(() => store.state.user.user);
    const loadingUser = computed(() => store.state.user.loading);

    return {
      user,
      loadingUser,
    };
  },
};
</script>
<style scoped>
</style>
