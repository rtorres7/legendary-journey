<template>
  <div>Search View</div>
  <div>{{ results }}</div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  setup() {
    const store = useStore();
    //const route = useRoute();
    const results = computed(() => store.state.search.results);

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch(useRoute(), () => {
      store.dispatch("search/search");
    });

    return {
      results,
    };
  },
};
</script>

<style>
</style>
