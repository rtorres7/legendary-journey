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
    <div>
      <nav
        class="
          relative
          z-0
          hidden
          md:inline-flex
          rounded-md
          shadow-sm
          -space-x-px
        "
        aria-label="Pagination"
      >
        <template v-if="currentPage === 1">
          <SearchResultsTablePaginationButton
            class="px-2 rounded-l-md"
            :disabled="true"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5"
          /></SearchResultsTablePaginationButton>
        </template>
        <template v-else>
          <SearchResultsTablePaginationButton
            class="px-2 rounded-l-md"
            @click="navigatePrevious(currentPage)"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5"
          /></SearchResultsTablePaginationButton>
        </template>
        <template
          v-for="n in buildPageButtons(currentPage, totalPages(totalCount))"
          :key="n"
        >
          <template v-if="n === '...'">
            <SearchResultsTablePaginationButton
              aria-current="page"
              :disabled="true"
              >...</SearchResultsTablePaginationButton
            >
          </template>
          <template v-else>
            <template v-if="currentPage === n">
              <SearchResultsTablePaginationButton
                aria-current="page"
                :current="true"
                :disabled="true"
                >{{ n }}</SearchResultsTablePaginationButton
              >
            </template>
            <template v-else>
              <SearchResultsTablePaginationButton @click="navigatePage(n)">{{
                n
              }}</SearchResultsTablePaginationButton>
            </template>
          </template>
        </template>
        <template v-if="currentPage === totalPages(totalCount)">
          <SearchResultsTablePaginationButton
            class="px-2 rounded-r-md"
            :disabled="true"
            ><span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5"
          /></SearchResultsTablePaginationButton>
        </template>
        <template v-else>
          <SearchResultsTablePaginationButton
            class="px-2 rounded-r-md"
            @click="navigateNext(currentPage)"
            ><span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5"
          /></SearchResultsTablePaginationButton>
        </template>
      </nav>
      <div
        class="relative z-0 inline-flex md:hidden rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <template v-if="currentPage === 1">
          <SearchResultsTablePaginationButton
            class="rounded-md"
            :disabled="true"
            >Previous</SearchResultsTablePaginationButton
          >
        </template>
        <template v-else>
          <SearchResultsTablePaginationButton
            class="rounded-md"
            @click="navigatePrevious(currentPage)"
            >Previous</SearchResultsTablePaginationButton
          >
        </template>
        <template v-if="currentPage === totalPages(totalCount)">
          <SearchResultsTablePaginationButton
            class="ml-3 rounded-md"
            :disabled="true"
            >Next</SearchResultsTablePaginationButton
          >
        </template>
        <template v-else>
          <SearchResultsTablePaginationButton
            class="ml-3 rounded-md"
            @click="navigateNext(currentPage)"
            >Next</SearchResultsTablePaginationButton
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";
import SearchResultsTablePaginationButton from "./SearchResultsTablePaginationButton";

export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchResultsTablePaginationButton,
  },
  props: {
    totalCount: Number,
    currentPage: Number,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const totalPages = (count) => {
      return Math.ceil(count / 50);
    };

    const startingResult = (page) => {
      return 50 * (page - 1) + 1;
    };

    const endingResult = (page, total) => {
      return 50 * page > total ? total : 50 * page;
    };

    const navigatePrevious = (current) => {
      router.push({
        name: "demo-search",
        query: { ...route.query, page: current - 1 },
      });
    };

    const navigateNext = (current) => {
      router.push({
        name: "demo-search",
        query: { ...route.query, page: current + 1 },
      });
    };

    const navigatePage = (page) => {
      router.push({
        name: "demo-search",
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
      console.log(
        `Pagination button builder result for page ${current} and total number pages of ${total} : [${buttons}]`
      );
      return buttons;
    };

    return {
      totalPages,
      startingResult,
      endingResult,
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
