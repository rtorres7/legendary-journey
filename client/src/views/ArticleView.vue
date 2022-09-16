<template>
  <template v-for="detail in danielArticleDetails" :key="detail">
    <div>
      {{ detail.doc_num }}
    </div>
    <div>
      {{ detail.title }}
    </div>  
  </template>

</template>

<script>

import { onMounted, computed } from "vue";
import { useStore } from "vuex";
export default {
  components: {
  },

  setup() {
    const store = useStore();

    const danielArticleDetails = computed(() => store.state.danielDetails.article);
    const loadingDanielArticleDetails = computed(() => store.state.danielDetails.loading);

    onMounted(() => {
      store.dispatch("danielDetails/getDanielArticleDetails");
    });

    return {
      danielArticleDetails,
      loadingDanielArticleDetails,
    };
  },
};
</script>

<style lang="scss" scoped></style>
