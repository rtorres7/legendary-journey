<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav
    class="relative z-0 hidden md:inline-flex rounded-md shadow-sm -space-x-px"
    aria-label="Pagination"
  >
    <template v-if="currentPage === 1">
      <PaginationButton class="px-2 rounded-l-md" :disabled="true">
        <span class="sr-only">Previous</span>
        <ChevronLeftIcon class="h-5 w-5"
      /></PaginationButton>
    </template>
    <template v-else>
      <PaginationButton
        class="px-2 rounded-l-md"
        @click="navigatePrevious(currentPage)"
      >
        <span class="sr-only">Previous</span>
        <ChevronLeftIcon class="h-5 w-5"
      /></PaginationButton>
    </template>
    <template
      v-for="n in buildPageButtons(currentPage, totalPages(totalCount))"
      :key="n"
    >
      <template v-if="n === '...'">
        <PaginationButton aria-current="page" :disabled="true"
          >...</PaginationButton
        >
      </template>
      <template v-else>
        <template v-if="currentPage === n">
          <PaginationButton
            aria-current="page"
            :current="true"
            :disabled="true"
            >{{ n }}</PaginationButton
          >
        </template>
        <template v-else>
          <PaginationButton @click="navigatePage(n)">{{ n }}</PaginationButton>
        </template>
      </template>
    </template>
    <template v-if="currentPage === totalPages(totalCount)">
      <PaginationButton class="px-2 rounded-r-md" :disabled="true"
        ><span class="sr-only">Next</span> <ChevronRightIcon class="h-5 w-5"
      /></PaginationButton>
    </template>
    <template v-else>
      <PaginationButton
        class="px-2 rounded-r-md"
        @click="navigateNext(currentPage)"
        ><span class="sr-only">Next</span> <ChevronRightIcon class="h-5 w-5"
      /></PaginationButton>
    </template>
  </nav>
  <div
    class="relative z-0 inline-flex md:hidden rounded-md shadow-sm"
    aria-label="Pagination"
  >
    <template v-if="currentPage === 1">
      <PaginationButton class="rounded-md" :disabled="true"
        >Previous</PaginationButton
      >
    </template>
    <template v-else>
      <PaginationButton
        class="rounded-md"
        @click="navigatePrevious(currentPage)"
        >Previous</PaginationButton
      >
    </template>
    <template v-if="currentPage === totalPages(totalCount)">
      <PaginationButton class="ml-3 rounded-md" :disabled="true"
        >Next</PaginationButton
      >
    </template>
    <template v-else>
      <PaginationButton
        class="ml-3 rounded-md"
        @click="navigateNext(currentPage)"
        >Next</PaginationButton
      >
    </template>
  </div>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";
import PaginationButton from "./PaginationButton";

export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    PaginationButton,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
    },
    maxPerPage: {
      type: Number,
      default: 50,
    },
    pages: {
      type: Number,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const totalPages = (count) => {
      if (props.pages) {
        return props.pages;
      }
      return Math.ceil(count / props.maxPerPage);
    };

    const navigatePrevious = (current) => {
      router.push({
        query: { ...route.query, page: current - 1 },
      });
    };

    const navigateNext = (current) => {
      router.push({
        query: { ...route.query, page: current + 1 },
      });
    };

    const navigatePage = (page) => {
      router.push({
        query: { ...route.query, page },
      });
    };

    const buildPageButtons = (current, total) => {
      const buttons = [];
      const before = current - 1;
      const after = current + 1;
      if (total <= 5) {
        for (let n = 1; n <= total; n++) {
          buttons.push(n);
        }
      } else {
        if (current < 5) {
          buttons.push(1, 2, 3);
          if (current >= 3) {
            buttons.push(4);
          }
          if (current === 4) {
            buttons.push(5);
          }
        } else {
          buttons.push(1, "...");
          if (current === total) {
            //last item
            buttons.push(before - 1, before, current);
          }
          if (total - current >= 1) {
            //at least the third item from last
            buttons.push(before, current, after);
          }
        }
        if (total - current > 1) {
          if (total - current === 2) {
            buttons.push(total);
          }
          if (total - current === 3) {
            buttons.push(total - 1, total);
          }
          if (total - current > 3) {
            buttons.push("...", total);
          }
        }
      }
      // console.log(
      //   `Pagination button builder result for page ${current} and total number pages of ${total} : [${buttons}]`
      // );
      return buttons;
    };

    return {
      totalPages,
      navigatePrevious,
      navigateNext,
      navigatePage,
      buildPageButtons,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
