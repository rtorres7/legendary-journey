<template>
  <div class="flex-1 flex items-center justify-between">
    <div>
      <p class="text-sm">
        Showing
        <span class="font-medium">{{ startingResult(currentPage) }}</span>
        to
        <span class="font-medium">{{
          endingResult(currentPage, totalCount)
        }}</span>
        of
        <span class="font-medium">{{ totalCount }}</span>
        results
      </p>
    </div>
    <Pagination :totalCount="totalCount" :currentPage="currentPage" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination,
  },
  props: {
    totalCount: {
      type: Number,
    },
    currentPage: {
      type: Number,
    },
    maxPerPage: {
      type: Number,
      default: 50,
    },
  },
  setup(props) {
    const startingResult = (page) => {
      return props.maxPerPage * (page - 1) + 1;
    };

    const endingResult = (page, total) => {
      return props.maxPerPage * page > total ? total : props.maxPerPage * page;
    };

    return {
      startingResult,
      endingResult,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
